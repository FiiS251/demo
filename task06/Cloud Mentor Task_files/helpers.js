// task statuses
const TASK_STATUS_NOT_STARTED = 'Not Started';
const TASK_STATUS_IN_PROGRESS = 'In Progress';
const TASK_STATUS_COMPLETED = 'Completed';


function setTaskStatusNotStarted(){
    console.log('Setting task status:', TASK_STATUS_NOT_STARTED);
    taskProgressStatus.innerText = TASK_STATUS_NOT_STARTED;
}


function setTaskStatusInProgress(){
    console.log('Setting task status:', TASK_STATUS_IN_PROGRESS);
    taskProgressStatus.innerText = TASK_STATUS_IN_PROGRESS;
}


function setTaskStatusCompleted(){
    console.log('Setting task status:', TASK_STATUS_COMPLETED);
    taskProgressStatus.innerText = TASK_STATUS_COMPLETED;
}

/**
 * Unblocks a button element, removes spinner from spans[0] and sets its text.
 * @param {string} elementId - The ID of the button element.
 * @param {string} buttonText - The text to set on the button.
 */
function unblockButtonAndSetText(elementId, buttonText) {
  const button = document.querySelector(`#${elementId}`);
  if (!button) {
    console.log(`Cannot unblock button - no element found with ID: ${elementId}`);
    return;
  }
  button.disabled = false;
  const spans = button.querySelectorAll('span');
  if (spans.length > 0) {
    spans[0].classList.remove('spinner-border');
    spans[1].innerText = buttonText;
    console.log(`Button ${elementId} unlocked`);
  }
}


function copyToClipboard(id) {
    var element = document.querySelector(`#${CSS.escape(id)}`);
    if (element) {
        var text = element.tagName.toLowerCase() === "input" ? element.value : element.innerText;
        navigator.clipboard.writeText(text);
    }
}


function getCookie(name) {
    const cookieString = decodeURIComponent(document.cookie);
    const cookies = cookieString.split('; ');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split('=');
      if (cookie[0] === name) {
        return cookie[1];
      }
    }

    return null;
  }


function sendGetRequest(url) {
    const sidValue = getCookie('_sid');
    const fullUrl = `${url}?_sid=${sidValue}`;
    window.location.href = fullUrl
  }


function generateLinuxEnvCommands(event) {
    const accessKeyId = event.data.validationAccessKeyId;
    const secretAccessKey = event.data.validationSecretAccessKey;
    const sessionToken = event.data.validationSessionToken;

    return `export AWS_ACCESS_KEY_ID="${accessKeyId}"
export AWS_SECRET_ACCESS_KEY="${secretAccessKey}"
export AWS_SESSION_TOKEN="${sessionToken}"`;
}


function generateWindowsEnvCommands(event) {
    const accessKeyId = event.data.validationAccessKeyId;
    const secretAccessKey = event.data.validationSecretAccessKey;
    const sessionToken = event.data.validationSessionToken;

    return `SET AWS_ACCESS_KEY_ID=${accessKeyId}
SET AWS_SECRET_ACCESS_KEY=${secretAccessKey}
SET AWS_SESSION_TOKEN=${sessionToken}`;
}


function generatePowerShellEnvCommands(event) {
    const accessKeyId = event.data.validationAccessKeyId;
    const secretAccessKey = event.data.validationSecretAccessKey;
    const sessionToken = event.data.validationSessionToken;

    return `$Env:AWS_ACCESS_KEY_ID="${accessKeyId}"
$Env:AWS_SECRET_ACCESS_KEY="${secretAccessKey}"
$Env:AWS_SESSION_TOKEN="${sessionToken}"`;
}


function updatePlaceholders(parentElementId, holders_content) {
    try {
        var placeholders = JSON.parse(holders_content);
    } catch (error) {
        console.error('Error while parsing placeholders to JSON:', error);
        return;
    }
    var html = taskDefinition.querySelector(`#${parentElementId}`).innerHTML;
    var regex = /\${(.*?)}/g;
    var matches = html.match(regex);

    if (matches != null) {
    var validPlaceholders = matches.filter(function(match) {
      var placeholder = match.substring(2, match.length - 1).trim();
      return placeholders.hasOwnProperty(placeholder);
    });

    validPlaceholders.forEach(function(match) {
      var placeholder = match.substring(2, match.length - 1).trim();
      var value = placeholders[placeholder];
      html = html.replace(match, value);
    });
    }
    taskDefinition.querySelector(`#${parentElementId}`).innerHTML = html;
}


function createLabelElement(id, label) {
    const labelElem = document.createElement('label');
    labelElem.setAttribute('for', id);
    labelElem.className = 'form-label';
    labelElem.textContent = label;
    return labelElem;
}


function createNoteElement(description) {
    const descriptionElem = document.createElement('small');
    descriptionElem.className = 'form-text text-muted';
    descriptionElem.innerHTML = description;
    return descriptionElem;
}


function appendChildElements(parentElementId, jsonData) {
    console.log(parentElementId, ' Adding dynamic fields from data: ', jsonData);
    const parentElement = document.getElementById(parentElementId);

    for (let id in jsonData) {
        const data = jsonData[id];

        if (data.label) {
            const labelElem = createLabelElement(parentElementId + id, data.label);
            parentElement.appendChild(labelElem);
        }

        const elem = document.createElement(data.tag);
        elem.id = parentElementId + id;

        for (let attr in data.attributes) {
            elem.setAttribute(attr, data.attributes[attr]);
        }

        if (data.tag === 'select' && data.allowed_values) {
            for (let i = 0; i < data.allowed_values.length; i++) {
                const option = document.createElement('option');
                option.value = data.allowed_values[i];
                option.text = data.allowed_values[i];
                // Set the first option as selected
                if (i === 0) {
                    option.selected = true;
                }
                elem.appendChild(option);
            }
        } else if (data.tag === 'input' && data.attributes.type === 'checkbox') {
            elem.setAttribute('value', 'true');
            elem.checked = data.checked || false;
        }

        const wrapperDiv = document.createElement('div');
        wrapperDiv.appendChild(elem);
        parentElement.appendChild(wrapperDiv);

        if (data.note) {
            const noteElem = createNoteElement(data.note);
            const noteWrapperDiv = document.createElement('div');
            noteWrapperDiv.appendChild(noteElem);
            parentElement.appendChild(noteWrapperDiv);
        }
    }
}


async function gatherAndValidateValues(parentElementId, jsonData) {
  const parentElement = document.getElementById(parentElementId);
  const parameters = {};

  const promises = [];

  for (let id in jsonData) {
    const data = jsonData[id];
    const elem = parentElement.querySelector('#' + parentElementId + id);

    if (data.required && (!elem.value || elem.value.trim() === '')) {
      const errorMessage = 'Required field ' + id + ' is empty';
      console.log('Validation Error:', errorMessage);
      return errorMessage;
    }

    if (data.tag === 'input' && data.attributes.type === 'file') {
      const file = elem.files[0];
      if (file) {
        const reader = new FileReader();
        const readPromise = new Promise((resolve, reject) => {
          reader.onload = function (event) {
             try {
              parameters[id] = JSON.parse(reader.result);
              resolve();
            } catch (error) {
              const errorMessage = 'Error parsing JSON: ' + id + ' ' + error.message;
              console.error(errorMessage);
              reject(errorMessage);
              return errorMessage;
            }
          };
          reader.onerror = function (event) {
            const errorMessage = 'Error reading file: ' + id + ' ' + event.target.error;
            console.error('Error reading file:', errorMessage);
            reject(errorMessage);
            return errorMessage;
          };
          reader.readAsText(file);
        });

        promises.push(readPromise);

      } else {
        console.error('No file selected.', id);
      }
    } else if (data.tag === 'input' && data.attributes.type === 'checkbox'){
      parameters[id] = elem.checked;
    } else {
      parameters[id] = elem.value;
    }
  }

  await Promise.all(promises);

  console.log('Gathered parameters', parameters);
  return parameters;
}


function updateElements(updateSourceData,
                        updateTargetData,
                        sourceParentElementId,
                        targetParentElementId) {

  const sourceParentElement = document.getElementById(sourceParentElementId);
  const targetParentElement = document.getElementById(targetParentElementId);

  for (let id in updateSourceData) {
    const sourceElement = updateSourceData[id];
    const targetElement = updateTargetData[id];

    if (targetElement) {
      console.log('updating Element', id);
      const sourceElem = sourceParentElement.querySelector('#' + sourceParentElementId + id);
      const targetElem = targetParentElement.querySelector('#' + targetParentElementId + id);
      console.log('sourceElem', sourceElem);
      console.log('targetElem', targetElem);
       if (sourceElem && targetElem) {
        if (targetElem.tagName === 'INPUT') {
          targetElem.value = sourceElem.value || '';
        } else if (targetElem.tagName === 'SELECT') {
          const options = targetElem.options;
          for (let i = 0; i < options.length; i++) {
            if (options[i].value === sourceElem.value) {
              options[i].selected = true;
              break;
            }
          }
        }
      }
    }
  }

  console.log('Elements updated');
}


/**
 * Toggles the enable/disable state of dynamic elements based on the provided JSON data.
 *
 * @param {string} parentElementId - The ID of the parent element containing the dynamic elements.
 * @param {Object} jsonData - The JSON data representing the dynamic elements.
 * @param {string} enable - The flag indicating whether to enable or disable the elements.
 *                           Use 'disable' to disable the elements, any other value to enable them.
 * @returns {void}
 */
function toggleDynamicData(parentElementId, jsonData, enable) {
    const parentElement = document.getElementById(parentElementId);

    for (let id in jsonData) {
        const targetElement = jsonData[id];
        if (targetElement) {
            const targetElem = parentElement.querySelector('#' + parentElementId + id);
            if (enable === 'disable') {
                targetElem.setAttribute('disabled', 'disabled');
            } else {
                targetElem.removeAttribute('disabled');
            }
        }
    }
    if (enable === 'disable') {
        console.log(parentElementId, 'disabled');
    } else {
        console.log(parentElementId, 'enabled');
    }
}


function ruleIsStored(description, ruleText, stepsFromEvent){
    let result = false;
    ruleTextArticle = JSON.parse(ruleText).article;

    stepsFromEvent.forEach((step) => {
        if (description.includes(step.description)) {
            step.meta.rules.forEach((rule) => {
                delete rule.description;
                if (rule.article === ruleTextArticle){
                    result = true;
                }
            });
        }
    });
    return result;
}
