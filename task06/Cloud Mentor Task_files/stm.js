// key elements ids
const FIRST_TEMP_CREDITS_BUTTON_ID = 'firstTempCreditsButton';
const FIRST_EXECUTION_TEMP_CREDITS_BUTTON_ID = 'firstExecutionTempCredits';
const SECOND_EXECUTION_TEMP_CREDITS_BUTTON_ID = 'secondExecutionTempCredits';
const SECOND_TEMP_CREDITS_BUTTON_ID = 'secondTempCreditsButton';
const VALIDATION_CREDITS_MODAL_ID = 'validationCreditsModal';
const VALIDATION_CREDITS_MODAL_CLOSE_BUTTON_ID = 'validationCreditsModalCloseButton';
const EXECUTION_CREDITS_MODAL_ID = 'executionCreditsModal';
const EXECUTION_CREDITS_MODAL_CLOSE_BUTTON_ID ='executionCreditsModalCloseButton';
const PASSWORD_VISIBILITY_ID = 'passwordVisibility';
const AI_SUMMARY_SWITCH_ID = 'AISummarySwitch';
const AI_SUMMARY_LOADER_ID = 'AISummaryLoader';
const AI_SUMMARY_ERROR_ALERT_TEMPLATE_ID = 'AISummaryErrorAlertTemplate';
const AI_SUMMARY_ERROR_ALERT_PLACEHOLDER_ID = 'AISummaryErrorAlertPlaceholder';
const AI_SUMMARY_ACCORDION = 'AISummaryAccordion';
const AI_SUMMARY_ACCORDION_BUTTON_ID = 'AISummaryAccordionButton';
const AI_SUMMARY_CONTENT_ID = 'AISummaryContent';
const EXECUTOR_FAILED_ID = 'executorFailed';
const TASK_VALIDATIONS_FAILED_ID = 'taskValidationsFailed';
const TASK_VALIDATIONS_FAILED_CLOSE_BUTTON_ID = 'taskValidationsFailedCloseButton';
const DESTROY_RESOURCES_BUTTON_ID = 'destroyResources';
const VALIDATION_MANAGEMENT_CONSOLE_URL = 'validationManagementConsoleURL';
const VALIDATION_ACCESS_KEY_ID_ID = 'validationAccessKeyId';
const VALIDATION_SECRET_ACCESS_KEY_ID = 'validationSecretAccessKey';
const VALIDATION_SESSION_TOKEN_ID = 'validationSessionToken';
const VALIDATION_LINUX_CREDS_ID = 'validationLinuxCreds';
const VALIDATION_WINDOWS_CREDS_ID = 'validationWindowsCreds';
const VALIDATION_POWERSHELL_CREDS_ID = 'validationPowerShellCreds';
const EVAL_ERROR_MESSAGE_ID = 'evalErrorMessage';

const EXECUTION_REGION_ID = 'executionRegion';
const EXECUTION_BUCKET_ID = 'executionBucket';
const EXECUTION_ACCESS_KEY_ID_ID = 'executionAccessKeyId';
const EXECUTION_SECRET_KEY = 'executionSecretKey';
const EXECUTION_SESSION_TOKEN = 'executionSessionToken';
const EXECUTION_PREFIX_ID = 'executionPrefix';
const EXECUTION_TAGS_ID = 'executionTags';
const EXECUTION_SUFFIX_ID = 'executionSuffix';
const SYNDICATE_GENERATE_LINUX_ID ='syndicateGenerateLinux';
const SYNDICATE_GENERATE_WINDOWS_ID = 'syndicateGenerateWindows';
const SYNDICATE_GENERATE_POWERSHELL_ID = 'syndicateGeneratePowerShell';
const SYNDICATE_UPDATE_CREDENTIALS_ID = 'syndicateUpdateCredentials';

const REPOSITORY_INPUT_ID = 'repositoryInput';
const DYNAMIC_VERIFY_PARAMETERS_ID = 'dynamicVerifyParameters';
const WRONG_REPOSITORY_MODAL_ID = 'wrongRepositoryModal';
const WRONG_REPOSITORY_MODAL_CLOSE_BUTTON_ID = 'wrongRepositoryCloseButton';
const DESTROY_TO_PROCEED_NOTIFICATION_ID = 'destroyToProceedNotification';
const DESTROY_RESOURCES_NOTIFICATION_BUTTON_ID= 'destroyResourcesNotificationButton';

let firstExecutionTempCredits;
let firstTempCreditsButton;
let secondExecutionTempCredits;
let secondTempCreditsButton;
let validationCreditsModal;
let validationCreditsModalCloseButton;
let executionCreditsModal;
let executionCreditsModalCloseButton;
let destroyResourcesButton;
let destroyToProceedNotification;
let destroyResourcesNotificationButton;
let validationManagementConsoleURL;
let validationAccessKeyId;
let validationSecretAccessKey;
let validationSessionToken;
let executionRegion;
let executionBucket;
let executionAccessKeyId;
let executionSecretKey;
let executionSessionToken;
let executionPrefix;
let executionTags;
let executionSuffix;
let validationLinuxCreds;
let validationWindowsCreds;
let validationPowerShellCreds;
let syndicateGenerateLinux;
let syndicateGenerateWindows;
let syndicateGeneratePowerShell;
let syndicateUpdateCredentials;
let AISummarySwitch;
let AISummaryLoader;
let AISummaryErrorAlertTemplate;
let AISummaryErrorAlertPlaceholder;
let AISummaryAccordion;
let AISummaryAccordionButton;
let AISummaryContent;
let executorFailed;
let taskValidationsFailed;
let taskValidationsFailedCloseButton;
let evalErrorMessage;

let dynamicParameters;


function generateSyndicateConfigCommand(event, lineBreakSymbol) {
    let executionTags = '';
    if (event.data.executionTags) {
    executionTags = Object.entries(event.data.executionTags)
        .map(([key, value]) => `${key}:${value}`)
        .join(',');
    }

    return `syndicate generate config --name "dev" ${lineBreakSymbol}
    --region "${event.data.executionRegion}" ${lineBreakSymbol}
    --bundle_bucket_name "${event.data.executionBucket}" ${lineBreakSymbol}
    --prefix "${event.data.executionPrefix}" ${lineBreakSymbol}
    --extended_prefix "${event.data.executionExtendedPrefix}" ${lineBreakSymbol}
    --tags "${executionTags}" ${lineBreakSymbol}
    --iam_permissions_boundary "${event.data.executionIAMPermissionsBoundary}" ${lineBreakSymbol}
    --access_key "${event.data.executionAccessKeyId}" ${lineBreakSymbol}
    --secret_key "${event.data.executionSecretKey}" ${lineBreakSymbol}
    --session_token "${event.data.executionSessionToken}"`;
}


function generateSyndicateCredentialsText(event) {
    return `expiration: ${event.data.executionExpiration}
temp_aws_access_key_id: ${event.data.executionAccessKeyId}
temp_aws_secret_access_key: ${event.data.executionSecretKey}
temp_aws_session_token: ${event.data.executionSessionToken}`;
}


function showExecutionCredentials(event){
    executionRegion.value = event.data.executionRegion;
    executionBucket.value = event.data.executionBucket;
    executionAccessKeyId.value = event.data.executionAccessKeyId;
    executionSecretKey.value = event.data.executionSecretKey;
    executionSessionToken.value = event.data.executionSessionToken;
    executionPrefix.value = event.data.executionPrefix;
//    executionTags.value = event.data.executionTags;
    if (event.data.executionTags) {
        executionTags.value = Object.entries(event.data.executionTags)
            .map(([key, value]) => `${key}:${value}`)
            .join(',');
    } else {
        executionTags.value = '';
    }
    syndicateGenerateLinux.innerText = generateSyndicateConfigCommand(event, LINUX_LINE_BREAK);
    syndicateGenerateWindows.innerText = generateSyndicateConfigCommand(event, CMD_LINE_BREAK);
    syndicateGeneratePowerShell.innerText = generateSyndicateConfigCommand(event, POWERSHELL_LINE_BREAK);
    syndicateUpdateCredentials.innerText = generateSyndicateCredentialsText(event);
    executionCreditsModal.show();
}


function showValidationCredentials(event){
    validationManagementConsoleURL.setAttribute('href', event.data.validationManagementConsoleURL);
    validationAccessKeyId.value = event.data.validationAccessKeyId;
    validationSecretAccessKey.value = event.data.validationSecretAccessKey;
    validationSessionToken.value = event.data.validationSessionToken;
    validationLinuxCreds.innerText = generateLinuxEnvCommands(event);
    validationWindowsCreds.innerText = generateWindowsEnvCommands(event);
    validationPowerShellCreds.innerText = generatePowerShellEnvCommands(event);
    validationCreditsModal.show();
}


function handleOngoingTask(event){
    startTaskButton.style.display = 'block';
    verifyTaskButton.style.display = 'none';
    verifyTaskButton.disabled = false;
    repositoryInput.disabled = false;
    abortTaskButton.disabled = true;
    let spans = verifyTaskButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = VERIFY;
    if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'enable');
    }
}


function handleVerifyStartJobFailedSucceeded(event){
    if (event.event == SUCCEEDED_EVENT){
        startTaskButton.style.display = 'none';
        verifyTaskButton.style.display = 'block';
        verifyTaskButton.disabled = true;
        repositoryInput.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
    } else if (event.event == FAILED_EVENT){
        executorFailed.classList.remove('d-none');
        startTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        repositoryInput.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.remove('spinner-border');
        spans[1].innerText = VERIFY;
        scrollToBottom();
    }
    if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
    }
}


function handleCleanStartJobSucceeded(event){
    if (event.event == SUCCEEDED_EVENT){
        taskValidationsFailed.classList.add('d-none');
        let spans = destroyResourcesButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = DESTROYING;
        destroyResourcesButton.disabled = true;
        destroyToProceedNotification.classList.add('d-none');
        scrollToBottom();
    }
}


function handleCleanStartJobFailed(event){
    return;
}


function handleEvalReady(event) {
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
    repositoryInput.disabled = false;
    verifyTaskButton.disabled = false;
    abortTaskButton.disabled = false;
    destroyResourcesButton.disabled = true;
    if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'enable');
    }
}


function handleEvalBegan(event){
    return;
}


function handleSetupSucceeded(event) {
    return;
}


function handleEvalFailedSucceeded(event){
    let container = taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`);
    let index = container.childElementCount + 1;
    let id = `validation-${index}`;
    let content;
    if (typeof event.data.validation == 'object') {
        content = JSON.stringify(event.data.validation, null, 2);
    } else {
        content = event.data.validation;
    }
    taskValidations.classList.remove('d-none');
    const validationResult = JSON.parse(event.data.validation);
    taskValidations.querySelector(`#${TASK_VALIDATIONS_ACCORDION_ID}`).appendChild(buildAccordionItem(
    id, validationResult.result, `Verification ${index}`, content
    ));
    // unlocking buttons
    let spans1 = verifyTaskButton.querySelectorAll('span');
    spans1[0].classList.remove('spinner-border');
    spans1[1].innerText = VERIFY;
    let spans2 = abortTaskButton.querySelectorAll('span');
    spans2[0].classList.remove('spinner-border');
    spans2[1].innerText = ABORT;
    repositoryInput.disabled = true;
    abortTaskButton.disabled = true;
    destroyResourcesButton.disabled = false;
    AISummarySwitch.disabled = false;
    if (event.event == SUCCEEDED_EVENT){
        destroyToProceedNotification.classList.remove('d-none');
    }
}


function handleEvalError(event){
    let spans = verifyTaskButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = VERIFY;
    if (event.data.error_message) {
        evalErrorMessage.innerText = event.data.error_message;
        evalErrorMessage.classList.remove('d-none');
    }
    repositoryInput.disabled = true;
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    destroyResourcesButton.disabled = false;
}


function handleAISummaryBegan(event){
    AISummaryLoader.classList.remove('d-none');
}


function handleAISummaryFailedSucceeded(event){
    AISummaryLoader.classList.add('d-none');
    if (event.event == SUCCEEDED_EVENT){
        AISummaryAccordionButton.classList.remove(BG_DANGER_SUBTLE);
        AISummaryAccordionButton.classList.add(BG_SUCCESS_SUBTLE);
    } else {
        AISummaryAccordionButton.classList.remove(BG_SUCCESS_SUBTLE);
        AISummaryAccordionButton.classList.add(BG_DANGER_SUBTLE);
    }
    AISummaryContent.innerHTML = event.data.summary;
    AISummaryAccordion.classList.remove('d-none');
    AISummaryAccordion.scrollIntoView({ behavior: 'smooth' });
}


function handleAISummaryError(event){
    AISummaryLoader.classList.add('d-none');
    let newAlert = AISummaryErrorAlertTemplate.cloneNode(true);
    newAlert.classList.remove('d-none');
    AISummaryErrorAlertPlaceholder.appendChild(newAlert);
}


function handleCleanupBegan(event){
    destroyToProceedNotification.classList.add('d-none');
}


function handleCleanupStatus(event){
    return;
}


function handleCleanupFailed(event){
    repositoryInput.disabled = true;
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
    taskFeedback.querySelector('fieldset').disabled = false;
}


function handleCleanupSucceeded(event){
    verifyTaskButton.disabled = true;
    repositoryInput.disabled = true;
    abortTaskButton.disabled = true;
    let spans = destroyResourcesButton.querySelectorAll('span');
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = DESTROY;
    destroymentContent.innerHTML = SUCCESS_CLEANUP_MESSAGE;
    taskFeedback.querySelector('fieldset').disabled = false;
}


function customSubmitFeedbackButton(){
    restartTask.classList.remove('d-none');
    feedbackThank.classList.remove('d-none');
}


function customRestartTaskButton(){
    AISummaryAccordion.classList.add('d-none');
}


function isValidRepositoryInput(repositoryInputValue) {
    if (repositoryInputValue.startsWith('http')) {
        return true;
    }
    wrongRepositoryModal.show();
	if (window.dynamicData && window.dynamicData.verify_params) {
        toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'enable');
    }
    return false;
}


document.addEventListener('DOMContentLoaded', () => {
    firstExecutionTempCredits = document.getElementById(FIRST_EXECUTION_TEMP_CREDITS_BUTTON_ID);
    firstTempCreditsButton = document.getElementById(FIRST_TEMP_CREDITS_BUTTON_ID);
    secondExecutionTempCredits = document.getElementById(SECOND_EXECUTION_TEMP_CREDITS_BUTTON_ID);
    secondTempCreditsButton = document.getElementById(SECOND_TEMP_CREDITS_BUTTON_ID);
    validationCreditsModal = new bootstrap.Modal(document.getElementById(VALIDATION_CREDITS_MODAL_ID), {});
    validationManagementConsoleURL = document.getElementById(VALIDATION_MANAGEMENT_CONSOLE_URL);
    validationAccessKeyId = document.getElementById(VALIDATION_ACCESS_KEY_ID_ID);
    validationSecretAccessKey = document.getElementById(VALIDATION_SECRET_ACCESS_KEY_ID);
    validationSessionToken = document.getElementById(VALIDATION_SESSION_TOKEN_ID);
    validationLinuxCreds = document.getElementById(VALIDATION_LINUX_CREDS_ID);
    validationWindowsCreds = document.getElementById(VALIDATION_WINDOWS_CREDS_ID);
    validationPowerShellCreds = document.getElementById(VALIDATION_POWERSHELL_CREDS_ID);
    validationCreditsModalCloseButton = document.getElementById(VALIDATION_CREDITS_MODAL_CLOSE_BUTTON_ID);
    executionCreditsModal = new bootstrap.Modal(document.getElementById(EXECUTION_CREDITS_MODAL_ID), {});
    executionRegion = document.getElementById(EXECUTION_REGION_ID);
    executionBucket = document.getElementById(EXECUTION_BUCKET_ID);
    executionAccessKeyId = document.getElementById(EXECUTION_ACCESS_KEY_ID_ID);
    executionSecretKey = document.getElementById(EXECUTION_SECRET_KEY);
    executionSessionToken = document.getElementById(EXECUTION_SESSION_TOKEN);
    executionPrefix = document.getElementById(EXECUTION_PREFIX_ID);
    executionTags = document.getElementById(EXECUTION_TAGS_ID);
    executionSuffix = document.getElementById(EXECUTION_SUFFIX_ID);
    syndicateGenerateLinux = document.getElementById(SYNDICATE_GENERATE_LINUX_ID);
    syndicateGenerateWindows = document.getElementById(SYNDICATE_GENERATE_WINDOWS_ID);
    syndicateGeneratePowerShell = document.getElementById(SYNDICATE_GENERATE_POWERSHELL_ID);
    syndicateUpdateCredentials = document.getElementById(SYNDICATE_UPDATE_CREDENTIALS_ID);
    executionCreditsModalCloseButton = document.getElementById(EXECUTION_CREDITS_MODAL_CLOSE_BUTTON_ID);

    repositoryInput = document.getElementById(REPOSITORY_INPUT_ID);
    wrongRepositoryModal = new bootstrap.Modal(document.getElementById(WRONG_REPOSITORY_MODAL_ID), {});
    wrongRepositoryCloseButton = document.getElementById(WRONG_REPOSITORY_MODAL_CLOSE_BUTTON_ID);
    passwordVisibility = document.getElementById(PASSWORD_VISIBILITY_ID);
    AISummarySwitch = document.getElementById(AI_SUMMARY_SWITCH_ID);
    AISummaryLoader = document.getElementById(AI_SUMMARY_LOADER_ID);
    AISummaryErrorAlertTemplate = document.getElementById(AI_SUMMARY_ERROR_ALERT_TEMPLATE_ID);
    AISummaryErrorAlertPlaceholder = document.getElementById(AI_SUMMARY_ERROR_ALERT_PLACEHOLDER_ID);
    AISummaryContent = document.getElementById(AI_SUMMARY_CONTENT_ID);
    AISummaryAccordion = document.getElementById(AI_SUMMARY_ACCORDION);
    AISummaryAccordionButton = document.getElementById(AI_SUMMARY_ACCORDION_BUTTON_ID);
    executorFailed = document.getElementById(EXECUTOR_FAILED_ID);
    taskValidationsFailed = document.getElementById(TASK_VALIDATIONS_FAILED_ID);
    taskValidationsFailedCloseButton = document.getElementById(TASK_VALIDATIONS_FAILED_CLOSE_BUTTON_ID);
    destroyResourcesButton = document.getElementById(DESTROY_RESOURCES_BUTTON_ID);
    destroyToProceedNotification = document.getElementById(DESTROY_TO_PROCEED_NOTIFICATION_ID);
    destroyResourcesNotificationButton = document.getElementById(DESTROY_RESOURCES_NOTIFICATION_BUTTON_ID);
    evalErrorMessage = document.getElementById(EVAL_ERROR_MESSAGE_ID);

    firstExecutionTempCredits.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_execution_credentials', {}));
    });
    firstTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_validation_credentials', {}));
    });
    secondExecutionTempCredits.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_execution_credentials', {}));
    });
    secondTempCreditsButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('get_validation_credentials', {}));
    });
    startTaskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        let repositoryInputValue = taskValidationForm.querySelector('#repositoryInput').value.trim();
        if (!isValidRepositoryInput(repositoryInputValue)) return;
        let dynamicParameters;
        if (window.dynamicData && window.dynamicData.verify_params) {
          dynamicParameters = await gatherAndValidateValues(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
        } else {
            dynamicParameters = {};
        }
        dynamicParameters.repository = taskValidationForm.querySelector('#repositoryInput').value.trim();
        body = buildBody('start_task', {
            type: VERIFY_START_JOB_STAGE,
            dynamic_parameters: dynamicParameters
        });
        this.ws.send(body);

        startTaskButton.style.display = 'none';
        verifyTaskButton.style.display = 'block';
        verifyTaskButton.disabled = true;
        repositoryInput.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
        if (window.dynamicData && window.dynamicData.verify_params) {
            toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
        }
    });
    passwordVisibility.addEventListener('click', (e) => {
        const type = repositoryInput.getAttribute('type') === 'password' ? 'text' : 'password';
        repositoryInput.setAttribute('type', type);
        passwordVisibility.querySelector('i').classList.toggle('fa-eye-slash');
    });
    verifyTaskButton.addEventListener('click', async (e) => {
        e.preventDefault();
        let repositoryInputValue = taskValidationForm.querySelector('#repositoryInput').value.trim();
        if (!isValidRepositoryInput(repositoryInputValue)) return;
        let dynamicParameters;
        if (window.dynamicData && window.dynamicData.verify_params) {
          dynamicParameters = await gatherAndValidateValues(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
        } else {
            dynamicParameters = {};
        }
        console.log('dynamicParameters: ', dynamicParameters);
        dynamicParameters.repository = taskValidationForm.querySelector('#repositoryInput').value.trim();
        this.ws.send(buildBody('send_input', {
            type: VERIFY_START_JOB_STAGE,
            dynamic_parameters: dynamicParameters
        }));

        verifyTaskButton.disabled = true;
        repositoryInput.disabled = true;
        abortTaskButton.disabled = true;
        let spans = verifyTaskButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = VERIFYING;
        executorFailed.classList.add('d-none');
        if (window.dynamicData && window.dynamicData.verify_params) {
            toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
        }
    });
    abortTaskButton.addEventListener('click', (e) => {
        abortTaskButton.disabled = true;
        verifyTaskButton.disabled = true;
        this.ws.send(buildBody('send_input', { 'type': 'abort' }));
        taskFeedback.querySelector('fieldset').disabled = false;
        taskFeedback.classList.remove('d-none');
        scrollToBottom();
        if (window.dynamicData && window.dynamicData.verify_params) {
            toggleDynamicData(DYNAMIC_VERIFY_PARAMETERS_ID,window.dynamicData.verify_params, 'disable');
        }
    });
    destroyResourcesButton.addEventListener('click', (e) => {
        taskValidationsFailed.classList.add('d-none');
        let spans = destroyResourcesButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = DESTROYING;
        destroyResourcesButton.disabled = true;
        destroyToProceedNotification.classList.add('d-none');
        this.ws.send(buildBody('send_input', { 'type': 'destroy_resources' }));
    });
    destroyResourcesNotificationButton.addEventListener('click', (e) => {
        let spans = destroyResourcesButton.querySelectorAll('span');
        spans[0].classList.add('spinner-border');
        spans[1].innerText = DESTROYING;
        destroyResourcesButton.disabled = true;
        destroyToProceedNotification.classList.add('d-none');
        this.ws.send(buildBody('send_input', { 'type': 'destroy_resources' }));
    });
    AISummarySwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      console.log('Eda recommendations enabled');
      this.ws.send(buildBody('get_ai_summary', {}));
    } else {
      console.log('Eda recommendations disabled');
      AISummaryAccordion.classList.add('d-none')
    }
  });
    validationCreditsModalCloseButton.addEventListener('click', (e) => {
        validationCreditsModal.hide();
    });
    executionCreditsModalCloseButton.addEventListener('click', (e) => {
        executionCreditsModal.hide();
    });
    wrongRepositoryCloseButton.addEventListener('click', (e) => {
        wrongRepositoryModal.hide();
    });
    taskValidationsFailedCloseButton.addEventListener('click', (e) => {
        taskValidationsFailed.classList.add('d-none');
    });

    console.log('dynamicData', window.dynamicData);
    if (window.dynamicData && window.dynamicData.verify_params) {
        appendChildElements(DYNAMIC_VERIFY_PARAMETERS_ID, window.dynamicData.verify_params);
    } else {
        console.log("No verify parameters");
    }
});

// must be runned after all js is loaded
setTimeout(() => {
  fetchAndReplayEvents()
    .finally(() => {
      // Code to be executed regardless of success or error
      unblockButtonAndSetText(START_TASK_BUTTON_ID, VERIFY);
    });
}, 1000);
