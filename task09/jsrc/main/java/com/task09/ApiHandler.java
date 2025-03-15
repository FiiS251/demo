package com.task09;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.syndicate.deployment.annotations.lambda.LambdaHandler;
import com.syndicate.deployment.annotations.lambda.LambdaLayer;
import com.syndicate.deployment.annotations.lambda.LambdaUrlConfig;
import com.syndicate.deployment.model.ArtifactExtension;
import com.syndicate.deployment.model.DeploymentRuntime;
import com.syndicate.deployment.model.RetentionSetting;
import com.syndicate.deployment.model.lambda.url.AuthType;
import com.syndicate.deployment.model.lambda.url.InvokeMode;

import static com.openmeteo.OpenMeteoApiClient.getWeatherForecast;

@LambdaHandler(
		lambdaName = "api_handler",
		roleName = "api_handler-role",
		layers = {"sdk-layer"},
		runtime = DeploymentRuntime.JAVA17,
		isPublishVersion = false,
		aliasName = "learn",
		logsExpiration = RetentionSetting.SYNDICATE_ALIASES_SPECIFIED
)
@LambdaLayer(
		layerName = "sdk-layer",
		libraries = {"lib/open-meteo-1.0-SNAPSHOT.jar"},
		runtime = DeploymentRuntime.JAVA17,
		artifactExtension = ArtifactExtension.ZIP
)
@LambdaUrlConfig(
		authType = AuthType.NONE,
		invokeMode = InvokeMode.BUFFERED
)
public class ApiHandler implements RequestHandler<Object, String> {

	private static final ObjectMapper MAPPER = new ObjectMapper();
	private static final String WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&" +
			"current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m";
	private static final String WEATHER_ENDPOINT = "/weather";
	private static final String HTTP_METHOD_GET = "GET";

	@Override
	public String handleRequest(Object input, Context context) {
		LambdaLogger logger = context.getLogger();
		JsonNode inputNode = MAPPER.valueToTree(input);

		String method = extractMethod(inputNode);
		String path = extractPath(inputNode);

		if (!isValidRequest(path, method)) {
			return generateBadRequestResponse(path, method);
		}

		try {
			String response = fetchWeatherData();
			logger.log("Weather Data: " + response);
			return response;
		} catch (Exception e) {
			logger.log("Error: " + e.getMessage());
			return "Failed to fetch weather data";
		}
	}

	private String extractMethod(JsonNode inputNode) {
		return inputNode.path("requestContext").path("http").path("method").asText();
	}

	private String extractPath(JsonNode inputNode) {
		return inputNode.path("rawPath").asText();
	}

	private boolean isValidRequest(String path, String method) {
		return WEATHER_ENDPOINT.equals(path) && HTTP_METHOD_GET.equals(method);
	}

	private String fetchWeatherData() throws Exception {
		String rawJson = getWeatherForecast(WEATHER_API_URL);
		return transformWeatherJson(rawJson);
	}

	private String transformWeatherJson(String json) throws Exception {
		JsonNode root = MAPPER.readTree(json);
		ObjectNode finalJson = MAPPER.createObjectNode();

		// Copy fields from source to destination
		copyField(root, finalJson, "latitude", JsonNode::asDouble);
		copyField(root, finalJson, "longitude", JsonNode::asDouble);
		copyField(root, finalJson, "generationtime_ms", JsonNode::asDouble);
		copyField(root, finalJson, "utc_offset_seconds", JsonNode::asInt);
		copyField(root, finalJson, "timezone", JsonNode::asText);
		copyField(root, finalJson, "timezone_abbreviation", JsonNode::asText);
		copyField(root, finalJson, "elevation", JsonNode::asDouble);

		// Copy object fields
		copyObjectField(root, finalJson, "hourly_units");
		copyObjectField(root, finalJson, "hourly");
		copyObjectField(root, finalJson, "current_units");
		copyObjectField(root, finalJson, "current");

		return MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(finalJson);
	}

	private void copyField(JsonNode source, ObjectNode target, String fieldName, FieldExtractor extractor) {
		JsonNode field = source.path(fieldName);
		if (!field.isMissingNode()) {
			target.put(fieldName, extractor.extract(field));
		}
	}

	private void copyObjectField(JsonNode source, ObjectNode target, String fieldName) {
		JsonNode field = source.path(fieldName);
		if (!field.isMissingNode()) {
			target.set(fieldName, field);
		}
	}

	private String generateBadRequestResponse(String path, String method) {
		try {
			ObjectNode responseJson = MAPPER.createObjectNode();
			responseJson.put("statusCode", 400);
			responseJson.put("message", String.format("Bad request syntax or unsupported method. Request path: %s. HTTP method: %s", path, method));
			return MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(responseJson);
		} catch (Exception e) {
			return "Error generating bad request response";
		}
	}

	@FunctionalInterface
	private interface FieldExtractor {
		Object extract(JsonNode node);
	}
}