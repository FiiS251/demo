package com.task03;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.syndicate.deployment.annotations.lambda.LambdaHandler;
import com.syndicate.deployment.model.Architecture;
import com.syndicate.deployment.model.DeploymentRuntime;
import com.syndicate.deployment.model.RetentionSetting;
import com.task03.dto.RouteKey;
import com.task03.event.CustomAPIGatewayProxyResponseEvent;
import com.task03.handler.GetHelloHandler;

import java.util.Map;

@LambdaHandler(lambdaName = "hello_world",
    aliasName = "learn",
	roleName = "hello_world-role",
	runtime = DeploymentRuntime.JAVA17,
	architecture = Architecture.ARM64,
	logsExpiration = RetentionSetting.SYNDICATE_ALIASES_SPECIFIED
)
public class HelloWorld implements RequestHandler<APIGatewayProxyRequestEvent, CustomAPIGatewayProxyResponseEvent> {
	private final Map<RouteKey, RequestHandler<APIGatewayProxyRequestEvent, CustomAPIGatewayProxyResponseEvent>> routeHandlers = Map.of(
			new RouteKey("GET", "/hello"), new GetHelloHandler()
	);

	@Override
	public CustomAPIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent apiGatewayProxyRequestEvent, Context context) {
		return routeHandlers.getOrDefault(getRouteKey(apiGatewayProxyRequestEvent), new GetHelloHandler())
				.handleRequest(apiGatewayProxyRequestEvent, context);
	}

	private RouteKey getRouteKey(APIGatewayProxyRequestEvent requestEvent) {
		return new RouteKey(requestEvent.getHttpMethod(), requestEvent.getPath());
	}
}
