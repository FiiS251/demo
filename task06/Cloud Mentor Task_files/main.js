// base events
const TASK_STAGE = 'task';
const INIT_STAGE = 'init';
const SETUP_STAGE = 'setup';
const EVAL_STAGE = 'eval';
const CLEANUP_STAGE = 'cleanup';
const ONBOARD_STAGE = 'onboard';
const AI_SUMMARY_STAGE = 'ai_summary';
const FEEDBACK_STAGE = 'feedback';


//batch events
const SETUP_START_JOB_STAGE = 'setup_start_job';
const VERIFY_START_JOB_STAGE = 'verify_start_job';
const CLEAN_START_JOB_STAGE = 'clean_start_job';


const READY_EVENT = 'ready';
const BEGAN_EVENT = 'began';
const STATUS_EVENT = 'status';
const FAILED_EVENT = 'failed';
const SUCCEEDED_EVENT = 'succeeded';
const ERROR_EVENT = 'error';
const SUBMITTED_EVENT = 'submitted';
const ABORTED_EVENT = 'aborted';

// key elements ids
const TASK_PROGRESS_STATUS_ID = 'taskProgressStatus';
const START_TASK_BUTTON_ID = 'startTaskButton';

const VERIFY_TASK_BUTTON_ID = 'verifyTaskButton';
const ABORT_TASK_BUTTON_ID = 'abortTaskButton';
const SUBMIT_FEEDBACK_BUTTON_ID = 'submitFeedbackButton';
const RESTART_TASK_BUTTON_ID = 'restartTaskButton';
const RESET_TASK_BUTTON_ID = 'resetTaskButton';
const RESET_TASK_MODAL_ID = 'resetTaskModal';
const CLOSE_DIALOG_BUTTON_ID = 'closeDialogButton';
const TASK_START_FORM_ID = 'taskStartForm';
const DEPLOYMENT_LOADER_ID = 'deploymentLoader';
const TASK_VALIDATIONS_ID = 'taskValidations';
const TASK_VALIDATIONS_ACCORDION_ID = 'validationsAccordion';
const FIRST_TEMPORARY_CREDITS_ID = 'firstTemporaryCredits';
const TASK_DEFINITION_ID = 'taskDefinition';
const TASK_DEFINITION_CONTENT_ID = 'definitionContent';
const SECOND_TEMPORARY_CREDITS_ID = 'secondTemporaryCredits';
const TASK_VALIDATION_FORM_ID = 'taskValidationForm';
const DESTROYMENT_LOADER_ID = 'destroymentLoader';
const DESTROYMENT_NOTIFICATION_ID = 'destroymentNotification';
const DESTROYMENT_NOTIFICATION_BUTTON_ID = 'destroymentNotificationButton';
const DESTROYMENT_CONTENT_ID = 'destroymentContent';
const TASK_FEEDBACK_ID = 'taskFeedback';
const FEEDBACK_THANK = 'feedbackThank';
const RESTART_TASK_ID = 'restartTask';
const RESTART_LOADER_ID = 'restartLoader';
const LIVE_ALERT_PLACEHOLDER_ID = 'liveAlertPlaceholder';

// WebSocket Config Constants

const EVENTS_URL = '/v1/events'; // v1 - MAJOR version. It should be changed if
                                 // major version will change
                                 // ('/v2/events' for 2nd version and so on

// linebrakes
CMD_LINE_BREAK = '^'
POWERSHELL_LINE_BREAK = '`'
LINUX_LINE_BREAK = '\\'

// labels
const START_TASK = 'Start task';
const DEPLOY_RESOURCES = 'Deploy resources';
const VERIFY = 'Verify';
const VERIFYING = 'Verifying...';
const ABORT = 'Abort';
const ABORTING = 'Aborting...';
const DESTROY = 'Destroy resources';
const DESTROYING = 'Destroying...';
const SUCCESS_CLEANUP_MESSAGE = 'Task resources have been successfully deleted!';

const BG_SUCCESS_SUBTLE = 'bg-success-subtle';
const BG_WARNING_SUBTLE = 'bg-warning-subtle';
const BG_DANGER_SUBTLE = 'bg-danger-subtle';
const RESET_TASK_DELAY = 1800000; // 1000 milliseconds = 1 second
const REFRESH_DELAY = 1000;

let taskProgressStatus;
let startTaskButton;
let verifyTaskButton;
let abortTaskButton;
let submitFeedbackButton;
let restartTaskButton;
let resetTaskButton;
let closeDialogButton;

let taskStartForm;
let deploymentLoader;
let firstTemporaryCredits;
let taskDefinition;
let secondTemporaryCredits;
let taskValidationForm;
let taskValidations;
let destroymentLoader;
let destroymentNotification;
let taskFeedback;
let feedbackThank;
let restartTask;
let liveAlertPlaceholder;
let resetTaskTimer;
let resetTaskModal;
let restartLoader;

let events; // collects stage events to rebuild page after reload

if (false) {  // or false
    console.log = () => { };
}

class JenkinsEvent {
    constructor(action, data) {
        this._action = action;  // string "[stage]:[event]"
        this._data = data;  // object
    }
    get stage() {
        return this._action.split(':')[0];
    }
    get event() {
        return this._action.split(':')[1];
    }
    set action(value) {
        if (value.split(':').length != 2) {
            console.warn(`Event came not from jenkins: ${value}`);
        }
        this._action = value;
    }
    get action() {
        return this._action;
    }
    get data() {
        return this._data;
    }
    static fromObject(obj) {
        return new JenkinsEvent(obj.action, obj.data);
    }
    isValid() {
        try {
            return Boolean(this.stage && this.event);
        } catch (error) {
            console.warn(`Error occurred checking whether the event is valid: ${error}`)
            return false;
        }

    }
}


const buildBody = function (action, data) {
    return JSON.stringify({
        action: action,
        data: data
    });
};


function showResetTaskModalWithDelay(delay) {
  resetTaskTimer = setTimeout(function () {
    resetTaskModal.show();
  }, delay);
}


function stopResetTaskTimer() {
  clearTimeout(resetTaskTimer);
    if (resetTaskModal) {
    resetTaskModal.hide(); // Hide the modal if it is shown
  }
}


function generateInnerAccordion(id, description) {
    try {
        const data = JSON.parse(description);
        const steps = data.validation_steps
        const innerAccordionContainer = document.createElement('div');
        innerAccordionContainer.className = 'accordion';

        steps.forEach((stepData, index) => {
            console.log(stepData);
            const isStepPassed = stepData.step_passed !== undefined ? stepData.step_passed : false;
            const buttonClass = isStepPassed ? BG_SUCCESS_SUBTLE : BG_DANGER_SUBTLE;

            const header = document.createElement('h2');
            header.className = 'accordion-header';

            if (isStepPassed === true) {
                const button = document.createElement("button");
                button.className = `accordion-button ${buttonClass} no-accordion`;
                button.setAttribute("type", "button");
                button.textContent = `${stepData.index}. ${stepData.description}`;
                button.style.backgroundImage = 'none';

                header.appendChild(button);
                header.style.marginBottom = "1px";
                innerAccordionContainer.appendChild(header);
            } else {
                const innerAccordionItem = document.createElement('div');
                innerAccordionItem.className = 'innerAccordion-item';

                const button = document.createElement('button');
                button.className = `accordion-button ${buttonClass}`;
                button.setAttribute('type', 'button');
                button.setAttribute('data-bs-toggle', 'collapse');
                button.setAttribute('data-bs-target', `#${id}-innerAccordion-${index}`);
                button.setAttribute('aria-expanded', 'false');
                button.textContent = `${stepData.index}. ${stepData.description}`;

                header.appendChild(button);

                const collapse = document.createElement('div');
                collapse.id = `${id}-innerAccordion-${index}`;
                collapse.className = 'accordion-collapse collapse';

                const body = document.createElement('div');
                body.className = 'accordion-body';
                body.style.whiteSpace = 'pre-wrap';
                body.innerHTML = JSON.stringify(stepData.meta, null, 2);

                collapse.appendChild(body);
                innerAccordionItem.style.marginBottom = '1px';
                innerAccordionItem.appendChild(header);
                innerAccordionItem.appendChild(collapse);
                innerAccordionContainer.appendChild(innerAccordionItem);
            }
        });

        return innerAccordionContainer;
    } catch (error) {
        console.error("Error parsing JSON for inner accordion items:", error);
        return null;
    }
}


function handleFeedbackReady(event) {
    taskFeedback.querySelector('fieldset').disabled = false;
}


function handleFeedbackSubmitted(event) {
    startTaskButton.disabled = true;
    verifyTaskButton.disabled = true;
    abortTaskButton.disabled = true;
    feedbackThank.classList.remove('d-none');
    restartTask.classList.remove('d-none');
    taskFeedback.querySelector('#feedbackScoreInput').value = event.data.score;
    taskFeedback.querySelector('#feedbackCommentInput').value = event.data.comment;
    taskFeedback.querySelector('fieldset').disabled = true;
}


function handleIncomingEvent(eventData) {
    console.log('Message received', eventData);
    let event = JenkinsEvent.fromObject(eventData);
    if (!event.isValid()) {
        console.log('Incoming event is not valid jenkins event. Maybe it is an event from adapter');
        if (event.action == 'failed') {
            stopResetTaskTimer();
            appendAlert(event.data.message, 'warning');
            taskStartForm.classList.remove('d-none');
            deploymentLoader.classList.add('d-none');
            handleOngoingTask(event);
        } else if (event.action == 'reload_ui'){
            // need to wait here so dynamodb will be updated on page reload
            console.log(`Sleeping ${REFRESH_DELAY / 1000} seconds`);
            setTimeout(function() {
                location.reload();
            }, REFRESH_DELAY);
                console.log('Reload ui completed');
        } else if (event.action == 'validation_credentials'){
            console.log('event.action == validation_credentials');
            showValidationCredentials(event);
        } else if (event.action == 'execution_credentials'){
            console.log('event.action == execution_credentials');
            showExecutionCredentials(event);
        }
        return;
    }
    // todo dispatch here
    if (event.stage == ONBOARD_STAGE){
        handleOnboard(event);
    } else if (event.stage == INIT_STAGE){
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    } else if (event.stage == SETUP_START_JOB_STAGE
            && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)){
        handleSetupStartJobFailedSucceeded(event);
    } else if (event.stage == SETUP_STAGE && event.event == BEGAN_EVENT) {
        taskStartForm.classList.add('d-none');
        deploymentLoader.classList.remove('d-none');
    } else if (event.stage == SETUP_STAGE && event.event == SUCCEEDED_EVENT) {
        // user should see "Reset task" button only in deploymentLoader section
        stopResetTaskTimer();
        taskStartForm.classList.add('d-none');
        handleSetupSucceeded(event);
    } else if (event.stage == SETUP_STAGE && event.event == ERROR_EVENT) {
        // user should see "Reset task" button only in deploymentLoader section
        stopResetTaskTimer();
        taskStartForm.classList.add('d-none');
        handleSetupError(event);
    } else if (event.stage == VERIFY_START_JOB_STAGE
            && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)){
        handleVerifyStartJobFailedSucceeded(event);
    } else if (event.stage == EVAL_STAGE && event.event == READY_EVENT) {
        stopResetTaskTimer();
        deploymentLoader.classList.add('d-none');
        setTaskStatusInProgress();
        handleEvalReady(event);
        scrollToBottom();
    } else if (event.stage == EVAL_STAGE && event.event == BEGAN_EVENT) {
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        handleEvalBegan(event);
        scrollToBottom();
    } else if (event.stage == EVAL_STAGE && event.event == ERROR_EVENT) {
        taskValidationsFailed.classList.remove('d-none');
        handleEvalError(event);
        scrollToBottom();
    } else if (event.stage == EVAL_STAGE && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)) {
        if (event.event == SUCCEEDED_EVENT){
            setTaskStatusCompleted();
        }
        handleEvalFailedSucceeded(event);
        scrollToBottom();
    } else if (event.stage == CLEAN_START_JOB_STAGE && event.event == FAILED_EVENT){
        handleCleanStartJobFailed(event);
    } else if (event.stage == CLEAN_START_JOB_STAGE && event.event == SUCCEEDED_EVENT){
        handleCleanStartJobSucceeded(event);
    } else if (event.stage == AI_SUMMARY_STAGE && event.event == BEGAN_EVENT) {
        handleAISummaryBegan(event);
    } else if (event.stage == AI_SUMMARY_STAGE && (event.event == FAILED_EVENT || event.event == SUCCEEDED_EVENT)) {
        handleAISummaryFailedSucceeded(event);
    } else if (event.stage == AI_SUMMARY_STAGE && event.event == ERROR_EVENT) {
        handleAISummaryError(event);
    } else if (event.stage == CLEANUP_STAGE && event.event == BEGAN_EVENT) {
        taskStartForm.classList.add('d-none');
        verifyTaskButton.disabled = true;
        abortTaskButton.disabled = true;
        let spans1 = verifyTaskButton.querySelectorAll('span');
        spans1[0].classList.remove('spinner-border');
        spans1[1].innerText = VERIFY;
        let spans2 = abortTaskButton.querySelectorAll('span');
        spans2[0].classList.remove('spinner-border');
        spans2[1].innerText = ABORT;
        // user should see "Reset task" button only in deploymentLoader section
        stopResetTaskTimer();
        deploymentLoader.classList.add('d-none');
        destroymentLoader.classList.remove('d-none');
        handleCleanupBegan(event);
        scrollToBottom();
    } else if (event.stage == CLEANUP_STAGE && event.event == STATUS_EVENT) {
        handleCleanupStatus(event);
        scrollToBottom();
    } else if (event.stage == CLEANUP_STAGE && event.event == FAILED_EVENT) {
        destroymentLoader.classList.add('d-none');
        taskFeedback.classList.remove('d-none');
        handleCleanupFailed(event);
        scrollToBottom();
    } else if (event.stage == CLEANUP_STAGE && event.event == SUCCEEDED_EVENT) {
        destroymentLoader.classList.add('d-none');
        taskFeedback.classList.remove('d-none');
        handleCleanupSucceeded(event);
        scrollToBottom();
    } else if (event.stage == FEEDBACK_STAGE && event.event == READY_EVENT) {
        taskFeedback.classList.remove('d-none');
        handleFeedbackReady(event);
        scrollToBottom();
    } else if (event.stage == FEEDBACK_STAGE && event.event == SUBMITTED_EVENT) {
        taskFeedback.classList.remove('d-none');
        handleFeedbackSubmitted(event);
        scrollToBottom();
    } else if (event.stage == TASK_STAGE && event.event == ABORTED_EVENT) {
        // TODO
        scrollToBottom();
    } else if (event.stage == TASK_STAGE && event.event == SUCCEEDED_EVENT) {
        // TODO
        scrollToBottom();
    }
}


// if html page will be rebooted it would collect events
// and then rebuild it to actual stage
function fetchAndReplayEvents() {
    return new Promise((resolve, reject) => {
        fetchEvents()
            .then((eventsData) => {
                if (!eventsData.items || eventsData.items.length === 0) {
                    console.log("No events fetched. Starting new task");
                    setTaskStatusNotStarted();
                } else {
                    console.log("Events fetched:", eventsData);
                replayEvents(eventsData);
                }
                resolve(); // Resolve the promise after the asynchronous code is complete
            })
            .catch((error) => {
                reject(error); // Reject the promise if an error occurs
            });
  });
}


function replayEvents(eventsData) {
  eventsData.items.forEach((eventData) => {
    handleIncomingEvent(eventData);
  });
}


function fetchEvents() {
  return fetch(EVENTS_URL, { method: "GET" })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}


function scrollToBottom() {
    console.log('Scrolling page');
    const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
    );
    const clientHeight = document.documentElement.clientHeight;
    const scrollPosition = scrollHeight - clientHeight;
    window.scroll({
        top: scrollPosition,
        left: 0,
        behavior: 'smooth'
    });
}


function createAccordionButton(id, title, color, className = '') {
    const item = document.createElement('div');
    item.className = `accordion-item ${className}`;

    const header = document.createElement('h2');
    header.className = 'accordion-header';

    const button = document.createElement('button');
    button.className = `accordion-button collapsed ${color}`;
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', `#${id}`);
    button.setAttribute('aria-expanded', 'false');
    button.textContent = title;

    header.appendChild(button);
    item.appendChild(header);

    return item;
}


function createAccordionBody(id, description, innerAccordionContent) {
    const collapse = document.createElement('div');
    collapse.id = id;
    collapse.className = 'accordion-collapse collapse';

    const body = document.createElement('div');
    body.className = 'accordion-body';
    body.style.whiteSpace = 'normal';
    body.appendChild(innerAccordionContent);

    collapse.appendChild(body);
    return collapse;
}


const buildAccordionItem = function (id, result, title, description) {
    const color = result === 'success' ? BG_SUCCESS_SUBTLE : BG_DANGER_SUBTLE;
    const item = createAccordionButton(id, title, color);
    const innerAccordionContent = generateInnerAccordion(id, description);
    const body = createAccordionBody(id, description, innerAccordionContent);
    item.appendChild(body);
    return item;
}


const appendAlert = (message, type) => {
    let wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    liveAlertPlaceholder.append(wrapper)
}

const setupWebSocket = () => {
    console.log('Initializing socket connection');
    this.ws = new WebSocket(`wss://nyxxtm4ycc.execute-api.eu-central-1.amazonaws.com/api?session_id=4060741400005118903:SEP_GL_6:stm:task06`)
    this.ws.onerror = function (e) {
        console.error('Web socket is in error', e);
    };
    this.ws.onopen = function (e) {
        console.log('Web socket is open');
    };
    this.ws.onmessage = function (e) {
        handleIncomingEvent(JSON.parse(e.data));
    };
    this.ws.onclose = function () {
        console.log('Web socket is closed');
        setTimeout(setupWebSocket, 1000);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Document was loaded');
    setupWebSocket();
    taskProgressStatus = document.getElementById(TASK_PROGRESS_STATUS_ID);
    startTaskButton = document.getElementById(START_TASK_BUTTON_ID);
    verifyTaskButton = document.getElementById(VERIFY_TASK_BUTTON_ID);
    abortTaskButton = document.getElementById(ABORT_TASK_BUTTON_ID);
    submitFeedbackButton = document.getElementById(SUBMIT_FEEDBACK_BUTTON_ID);
    restartTaskButton = document.getElementById(RESTART_TASK_BUTTON_ID);
    resetTaskButton = document.getElementById(RESET_TASK_BUTTON_ID);
    closeDialogButton = document.getElementById(CLOSE_DIALOG_BUTTON_ID);
    taskStartForm = document.getElementById(TASK_START_FORM_ID);
    deploymentLoader = document.getElementById(DEPLOYMENT_LOADER_ID);
    firstTemporaryCredits = document.getElementById(FIRST_TEMPORARY_CREDITS_ID);
    taskDefinition = document.getElementById(TASK_DEFINITION_ID);
    secondTemporaryCredits = document.getElementById(SECOND_TEMPORARY_CREDITS_ID);
    taskValidationForm = document.getElementById(TASK_VALIDATION_FORM_ID);
    taskValidations = document.getElementById(TASK_VALIDATIONS_ID);
    destroymentLoader = document.getElementById(DESTROYMENT_LOADER_ID);
    destroymentNotification = document.getElementById(DESTROYMENT_NOTIFICATION_ID);
    destroymentNotificationButton = document.getElementById(DESTROYMENT_NOTIFICATION_BUTTON_ID);
    destroymentContent = document.getElementById(DESTROYMENT_CONTENT_ID);
    taskFeedback = document.getElementById(TASK_FEEDBACK_ID);
    feedbackThank = document.getElementById(FEEDBACK_THANK);
    restartTask = document.getElementById(RESTART_TASK_ID);
    restartLoader = document.getElementById(RESTART_LOADER_ID);
    liveAlertPlaceholder = document.getElementById(LIVE_ALERT_PLACEHOLDER_ID);
    resetTaskModal = new bootstrap.Modal(document.getElementById(RESET_TASK_MODAL_ID));


    submitFeedbackButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.ws.send(buildBody('send_feedback', {
            type: 'send_feedback',
            parameters: {
                feedback_score: taskFeedback.querySelector('#feedbackScoreInput').value,
                feedback_comments: taskFeedback.querySelector('#feedbackCommentInput').value
            }
        }));
        taskFeedback.querySelector('fieldset').disabled = true;
        feedbackThank.classList.remove('d-none');
        customSubmitFeedbackButton();
    });
    restartTaskButton.addEventListener('click', (e) => {
        this.ws.send(buildBody('restart_task', {}));
        customRestartTaskButton();
        deploymentLoader.classList.add('d-none');
        secondTemporaryCredits.classList.add('d-none');
        taskValidationForm.classList.add('d-none');
        taskValidations.classList.add('d-none');
        taskValidationsFailed.classList.add('d-none');
        destroymentNotification.classList.add('d-none');
        taskFeedback.classList.add('d-none');
        restartTask.classList.add('d-none');
        restartLoader.classList.remove('d-none');
        console.log('restarting');
    });
    resetTaskButton.addEventListener('click', (e) => {
        this.ws.send(buildBody('reset_task', {}));
        deploymentLoader.classList.add('d-none');
        taskDefinition.classList.add('d-none');
        secondTemporaryCredits.classList.add('d-none');
        taskFeedback.classList.remove('d-none');
        console.log('reseting task');
    });
    closeDialogButton.addEventListener('click', (e) => {
        resetTaskModal.hide();
        showResetTaskModalWithDelay(RESET_TASK_DELAY);
    });
});

//window.onload = function() {
//  fetchAndReplayEvents();
//}