# task06 AWS Lambda + DynamoDB Stream Integration

```shell
syndicate generate project --name task06
cd task06
syndicate generate config --name "dev" `
    --region "eu-central-1" `
    --bundle_bucket_name "syndicate-education-platform-custom-sandbox-artifacts-sbox02/67d6e834/task06" `
    --prefix "cmtr-67d6e834-" `
    --extended_prefix "true" `
    --tags "course_id:SEP_GL_6,course_type:stm,student_id:67d6e834,type:student" `
    --iam_permissions_boundary "arn:aws:iam::905418349556:policy/eo_role_boundary" `
    --access_key "" `
    --secret_key "" `
    --session_token ""
[System.Environment]::SetEnvironmentVariable('SDCT_CONF', 'C:\projects\serverless\aws\epam_serverless_aws_deep_dive_06\task06\.syndicate-config-dev', [System.EnvironmentVariableTarget]::Process)
```

```shell
syndicate generate lambda `
    --name audit_producer `
    --runtime java

syndicate generate meta dynamodb `
    --resource_name Configuration `
    --hash_key_name key `
    --hash_key_type S `
    --read_capacity 1 `
    --write_capacity 1

syndicate generate meta dynamodb `
    --resource_name Audit `
    --hash_key_name id `
    --hash_key_type S `
    --read_capacity 1 `
    --write_capacity 1

```