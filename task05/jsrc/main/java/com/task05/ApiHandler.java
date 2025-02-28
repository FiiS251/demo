package com.task05;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.model.PutItemRequest;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.syndicate.deployment.annotations.environment.EnvironmentVariable;
import com.syndicate.deployment.annotations.environment.EnvironmentVariables;
import com.syndicate.deployment.annotations.lambda.LambdaHandler;
import com.syndicate.deployment.model.Architecture;
import com.syndicate.deployment.model.DeploymentRuntime;
import com.syndicate.deployment.model.RetentionSetting;
import org.joda.time.DateTimeZone;
import org.joda.time.format.ISODateTimeFormat;
import com.google.gson.Gson;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;


@LambdaHandler(
		lambdaName = "api_handler",
		aliasName = "learn",
		roleName = "api_handler-role",
		runtime = DeploymentRuntime.JAVA17,
		architecture = Architecture.ARM64,
		isPublishVersion = false,
		logsExpiration = RetentionSetting.SYNDICATE_ALIASES_SPECIFIED
)
@EnvironmentVariables({
		@EnvironmentVariable(key = "region", value = "${region}"),
		@EnvironmentVariable(key = "table", value = "${target_table}")
})
public class ApiHandler implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

	private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
	private static final int SC_CREATED = 201;
	private static final String REGION = "eu-central-1";
	private static final String TABLE_NAME = "cmtr-d0429c20-Events-test";

	private final AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard()
			.withRegion(REGION)
			.build();

	@Override
	public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
		context.getLogger().log("Request: " + request.getBody());

		Event event;
		try {
			event = OBJECT_MAPPER.readValue(request.getBody().replace("content", "body"), Event.class);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to parse event JSON", e);
		}

		context.getLogger().log("Event before: " + event);
		event.setId(UUID.randomUUID().toString());
		event.setCreatedAt(formatUsingJodaTime(org.joda.time.LocalDate.now()));
		context.getLogger().log("Event after: " + event);

		Map<String, AttributeValue> item = createDynamoDBItem(event);
		context.getLogger().log("Item: " + item);

		client.putItem(new PutItemRequest().withTableName(TABLE_NAME).withItem(item));
		context.getLogger().log("Item added to table: " + TABLE_NAME);

		return createResponse(event);
	}

	private Map<String, AttributeValue> createDynamoDBItem(Event event) {
		Map<String, AttributeValue> item = new HashMap<>();
		item.put("id", new AttributeValue().withS(event.getId()));
		item.put("principalId", new AttributeValue().withN(String.valueOf(event.getPrincipalId())));
		item.put("createdAt", new AttributeValue().withS(event.getCreatedAt()));

		Map<String, AttributeValue> bodyMap = new HashMap<>();
		event.getBody().forEach((key, value) -> bodyMap.put(key, new AttributeValue().withS(value)));
		item.put("body", new AttributeValue().withM(bodyMap));

		return item;
	}

	private APIGatewayProxyResponseEvent createResponse(Event event) {
		Response responseObj = new Response(SC_CREATED, event);
		APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent().withStatusCode(SC_CREATED);
		try {
			response.setBody(OBJECT_MAPPER.writeValueAsString(responseObj));
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Failed to serialize response JSON", e);
		}
		return response;
	}

	private static String formatUsingJodaTime(org.joda.time.LocalDate localDate) {
		return ISODateTimeFormat.dateTime().print(localDate.toDateTimeAtStartOfDay(DateTimeZone.UTC));
	}

	public static class Event {
		@JsonProperty("id")
		private String id;
		@JsonProperty("principalId")
		private int principalId;
		@JsonProperty("createdAt")
		private String createdAt;
		@JsonProperty("body")
		private Map<String, String> body;

		public String getId() { return id; }
		public void setId(String id) { this.id = id; }
		public int getPrincipalId() { return principalId; }
		public void setPrincipalId(int principalId) { this.principalId = principalId; }
		public String getCreatedAt() { return createdAt; }
		public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
		public Map<String, String> getBody() { return body; }
		public void setBody(Map<String, String> body) { this.body = body; }

		@Override
		public String toString() { return new Gson().toJson(this); }
	}
}


