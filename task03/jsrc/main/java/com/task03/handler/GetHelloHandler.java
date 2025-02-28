package com.task03.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.task03.event.CustomAPIGatewayProxyResponseEvent;

public class GetHelloHandler implements RequestHandler<APIGatewayProxyRequestEvent, CustomAPIGatewayProxyResponseEvent> {

    private static final int SC_OK = 200;
    private static final String HELLO_MESSAGE = "Hello from Lambda";
    @Override
    public CustomAPIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent apiGatewayProxyRequestEvent, Context context) {
        return new CustomAPIGatewayProxyResponseEvent()
                .withStatusCode(SC_OK)
                .withMessage(HELLO_MESSAGE);
    }
}
