# task07 AWS Lambda + CloudWatch Rule + S3 Integration

```shell
syndicate generate project --name task07
cd task07
syndicate generate config --name "dev" `
    --region "eu-central-1" `
    --bundle_bucket_name "syndicate-education-platform-custom-sandbox-artifacts-sbox02/67d6e834/task07" `
    --prefix "cmtr-67d6e834-" `
    --extended_prefix "true" `
    --tags "course_id:SEP_GL_6,course_type:stm,student_id:67d6e834,type:student" `
    --iam_permissions_boundary "arn:aws:iam::905418349556:policy/eo_role_boundary" `
    --access_key "" `
    --secret_key "" `
    --session_token ""
[System.Environment]::SetEnvironmentVariable('SDCT_CONF', 'C:\projects\serverless\aws\epam_serverless_aws_deep_dive_06\task07\.syndicate-config-dev', [System.EnvironmentVariableTarget]::Process)
```

```shell
syndicate generate lambda `
    --name uuid_generator `
    --runtime java
    
syndicate generate meta cloudwatch_event_rule `
    --resource_name uuid_trigger `
    --rule_type schedule `
    --expression "rate(1 minutes)"
    
syndicate generate meta s3_bucket `
    --resource_name uuid-storage
```