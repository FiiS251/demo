package com.task03.event;

import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;

public class CustomAPIGatewayProxyResponseEvent extends APIGatewayProxyResponseEvent {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public CustomAPIGatewayProxyResponseEvent withStatusCode(Integer statusCode) {
        super.setStatusCode(statusCode);
        return this;
    }

    public CustomAPIGatewayProxyResponseEvent withMessage(String message) {
        setMessage(message);
        return this;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{");
        if (this.getStatusCode() != null) {
            sb.append("statusCode: ").append(this.getStatusCode()).append(",");
        }
        if (this.getBody() != null) {
            sb.append("message: ").append(this.getBody());
        }
        sb.append("}");
        return sb.toString();
    }
}
