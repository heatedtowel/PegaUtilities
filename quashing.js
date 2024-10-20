javascript:(function () {
    const checkForExistingBookmarklets = () => {
        const existingBookmarkletNodes = document.querySelectorAll(".bookMarklet");
    
        if (existingBookmarkletNodes.length) {
            for (const element in existingBookmarkletNodes) {
                if (element === 'entries') break;
                existingBookmarkletNodes[element].remove();
            }
            console.log('All elements have been cleared.');
            return;
        }
        displayRegionSelect();
    };

    const createOverlay = () => {
        let overlay = document.createElement('div');
        overlay.className = 'bookMarklet';
        overlay.style.position = 'fixed';
        overlay.style.top = '10%';
        overlay.style.left = '15%';
        overlay.style.width = '500px';
        overlay.style.backgroundColor = '#f0f0f0';
        overlay.style.display = 'flex';
        overlay.style.gap = '5px';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.flexWrap = 'wrap';
        overlay.style.borderRadius  = '8px';
        overlay.style.padding  = '1rem';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');

        let header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'flex-end';
        header.style.width = '100%';

        let closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.setAttribute('aria-label', 'close');
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.backgroundColor = 'lightGrey';
        closeBtn.style.borderRadius = '1rem';

        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

        header.appendChild(closeBtn);
        overlay.appendChild(header);

        return overlay;
    };

    const displayRegionSelect = () => {
        let regionOptions = ['NCSA', 'EMEA', 'APAC'];
        let currentRegion = getLocalStorage('region');
        let currentName = getLocalStorage('name');

        let overlay = createOverlay();

        let title = document.createElement('h1');
        title.textContent = 'Quashing Template Generator';
        title.style.margin = 0;
        title.style.color = 'black';

        let btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.gap = '1rem';

        let dropdownContainer = document.createElement('div');
        dropdownContainer.style.display = 'flex';
        dropdownContainer.style.flexDirection ='column';
        dropdownContainer.style.alignItems = 'flex-start';
        dropdownContainer.style.justifyContent = 'center';

        let dropdownLabel = document.createElement('h2');
        dropdownLabel.setAttribute('for', 'regionSelect');
        dropdownLabel.textContent = !currentRegion && !currentName ? 'Please select your region and name' : 'Region and name saved';
        dropdownLabel.style.color = !currentRegion && !currentName ? 'red' : 'green';

        let selectElement = document.createElement('select');
        selectElement.name = 'regions';
        selectElement.id = 'regionSelect';
        selectElement.disabled = currentRegion;
        selectElement.required = true;

        regionOptions.map(option => {
            let newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;

            selectElement.appendChild(newOption);
        });

        dropdownContainer.appendChild(dropdownLabel);
        dropdownContainer.appendChild(selectElement);

        let nameInput = document.createElement('input');
        nameInput.id = 'engineerName';
        nameInput.disabled = currentName;
        nameInput.type = 'text';
        nameInput.placeholder = !currentName ? 'Enter Name' : currentName;
        nameInput.required = true;

        let saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.setAttribute('aria-label', 'Save');
        saveBtn.disabled = currentName && currentRegion;
        saveBtn.style.padding = '2px 8px';
        saveBtn.style.borderRadius = '1rem';
        saveBtn.style.backgroundColor = 'lightGrey';
        saveBtn.style.cursor = 'pointer';

        saveBtn.addEventListener('click', () => {
            let regionSelection = document.getElementById('regionSelect').value;

            if (!currentName) {
                let newName = document.getElementById('engineerName').value;
                if (!newName || !regionSelection) {
                    return alert('Both name and region are required');
                }
                setLocalStorage('name', newName);
                setLocalStorage('region', regionSelection);
                currentName = newName;
                currentRegion = regionSelection;
                overlay.remove();
                checkForExistingBookmarklets();
            }
        });

        let resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.setAttribute('aria-label', 'Reset Username and Region');
        resetBtn.style.padding = '2px 8px';
        resetBtn.style.borderRadius = '1rem';
        resetBtn.style.backgroundColor = 'lightGrey';
        resetBtn.style.cursor = 'pointer';

        resetBtn.addEventListener('click' , () => {
            localStorage.clear();
            overlay.remove();
            checkForExistingBookmarklets();
        });

        let nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.setAttribute('aria-label', 'Next');
        nextButton.style.padding = '2px 8px';
        nextButton.style.borderRadius = '1rem';
        nextButton.style.backgroundColor = 'lightGrey';
        nextButton.style.cursor = 'pointer';

        nextButton.addEventListener('click' , () => {
            if (!currentName || !currentRegion) {
                return alert('Both name and region are required');
            }
            overlay.remove();
            displayEnoughInformationToTriage(currentRegion, currentName);
        });

        btnContainer.appendChild(saveBtn);
        btnContainer.appendChild(resetBtn);
        btnContainer.appendChild(nextButton);

        overlay.appendChild(title);
        overlay.appendChild(dropdownContainer);
        overlay.appendChild(nameInput);
        overlay.appendChild(btnContainer);
        document.body.appendChild(overlay);
    };

    const setLocalStorage = (name, param) => {
        localStorage.setItem(name, param);
    };

    const getLocalStorage = (key) => {
        const localItem = localStorage.getItem(key);

        if (!localItem) {
            return false;
        }
        return localItem;
    };

    const displayEnoughInformationToTriage = (region, name) => {
        const informationOptions = ['Yes', 'No'];

        let overlay = createOverlay();

        let dropdownContainer = document.createElement('div');
        dropdownContainer.style.display = 'flex';
        dropdownContainer.style.gap = '1.5rem';
        dropdownContainer.style.flexDirection ='column';
        dropdownContainer.style.alignItems = 'center';
        dropdownContainer.style.justifyContent = 'center';

        let dropdownLabel = document.createElement('h2');
        dropdownLabel.setAttribute('for', 'informationToTriage');
        dropdownLabel.textContent = 'Did the client provide enough information to triage?';
        dropdownLabel.style.color = 'black';

        let selectElement = document.createElement('select');
        selectElement.name = 'informationSelection';
        selectElement.id = 'informationToTriage';

        informationOptions.map(option => {
            let newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;

            selectElement.appendChild(newOption);
        });

        let nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.setAttribute('aria-label', 'Next');
        nextButton.style.padding = '2px 8px';
        nextButton.style.borderRadius = '1rem';
        nextButton.style.backgroundColor = 'lightGrey';
        nextButton.style.cursor = 'pointer';

        dropdownContainer.appendChild(dropdownLabel);
        dropdownContainer.appendChild(selectElement);
        dropdownContainer.appendChild(nextButton);

        overlay.appendChild(dropdownContainer);
        document.body.appendChild(overlay);

        nextButton.addEventListener('click', () => {
            const selection = document.getElementById('informationToTriage').value;

            if (selection === 'Yes') {
                overlay.remove();
                return displayTemplate(region, name);
            }
            overlay.remove();
            displayQuestions(region, name);
        })
    };

    const displayTemplate = (region, name, questionList = null) => {
        const quashTemplate = {
            responseYes:
            `Thank you for reaching out to Pega GCS Support,
            \nWe are currently routing your request to the appropriate engineer for this request. You will be notified once an engineer has been assigned.
            \nRegards,
            \n      ${name}`,
            responseNo:
            `Thank you for reaching out to Pega GCS Support,
            \nWe are currently routing your request to the appropriate engineer for this request. While we are looking for an engineer can you provide additional information to help expedite a resolution.
            \n${(function listQuestions() {
                return questionList?.map(question => `\n${question}`);
            })()}\n
            \nRegards,
            \n      ${name}`
        };
        const quashTags = [`#uxpx${region.toLowerCase()}-global`,`#uxpx${region.toLowerCase()}-return`,'#uxpxquashed'];

        let overlay = createOverlay();

        let responseContainer = document.createElement('div');
        responseContainer.style.display = 'flex';
        responseContainer.style.flexDirection = 'column';
        responseContainer.style.gap = '1rem';
        responseContainer.style.flexWrap = 'wrap';
        responseContainer.style.alignItems = 'center';
        responseContainer.style.justifyContent = 'center';
        responseContainer.style.width = 'fit-content';

        let title = document.createElement('h1');
        title.textContent = 'Quashing Template';
        title.style.margin = 0;
        title.style.color = 'black';

        let template = document.createElement('p');
        template.id  = 'quashTemplate';
        if (questionList != null) {
            template.textContent = quashTemplate.responseNo;
        }
        else {
            template.textContent = quashTemplate.responseYes;
        }
        template.style.margin = 0;
        template.style.color = 'black';
        template.style.fontSize = '1.6rem';

        let tagContainer = document.createElement('div');
        tagContainer.style.display = 'flex';
        tagContainer.style.gap = '1rem';
        tagContainer.style.alignItems = 'center';
        tagContainer.style.justifyContent = 'center';

        const generateTags = () => {
            quashTags.map(tag => {
            let hashTags = document.createElement('p');
            hashTags.id  = tag;
            hashTags.textContent = tag;
            hashTags.style.margin = 0;
            hashTags.style.color = 'black';
            hashTags.style.fontSize = '1.6rem';

            let copyHashtags = document.createElement('button');
            copyHashtags.id = `copy${tag}`;
            copyHashtags.textContent = 'Copy';
            copyHashtags.setAttribute('aria-label', 'Copy Hashtag');
            copyHashtags.setAttribute('data-tag', tag);
            copyHashtags.title = `copy ${tag}`;
            copyHashtags.style.padding = '2px 8px';
            copyHashtags.style.borderRadius = '1rem';
            copyHashtags.style.backgroundColor = 'lightGrey';
            copyHashtags.style.cursor = 'pointer';
    
            copyHashtags.addEventListener('click', (e) => {
                const selection = document.getElementById(`${e.target.dataset.tag}`);

                e.target.textContent = 'Copied';
                navigator.clipboard.writeText(selection.textContent);
            });
            tagContainer.appendChild(hashTags);
            tagContainer.appendChild(copyHashtags);
            });
            overlay.appendChild(tagContainer);
        };

        let copyResponse = document.createElement('button');
        copyResponse.textContent = 'Copy Response';
        copyResponse.setAttribute('aria-label', 'Copy Response');
        copyResponse.style.padding = '2px 8px';
        copyResponse.style.borderRadius = '1rem';
        copyResponse.style.backgroundColor = 'lightGrey';
        copyResponse.style.cursor = 'pointer';

        copyResponse.addEventListener('click', (e) => {
            let selection = document.getElementById('quashTemplate');

            e.target.textContent = 'Copied';
            navigator.clipboard.writeText(selection.textContent);
        });

        responseContainer.appendChild(title);
        responseContainer.appendChild(template);
        responseContainer.appendChild(copyResponse);
        overlay.appendChild(responseContainer);
        generateTags();
        document.body.appendChild(overlay);
    };

    const displayQuestions = (region, name) => {
        const quashQuestions = {
            customized: 'Is the section being used customized from OOTB?',
            track: 'Please provide a Pega trace of the working / non-working scenario, if possible.',
            environment: 'Is this happening in all environments? ex. Production, Dev, Testing?',
            image: 'Can you provide images or screenshots?',
            occurance: 'When did this issue first occur?',
            recurring: 'Is this issue recurring, or did it only happen once?',
            updates: 'Has anything changed in the environment recently? ex. Updates, new integrations, configuration changes?',
            affectedUsers: 'Are all users or departments affected?',
            error: 'Is there a specific error message or code?',
            specificDevice: 'Is this issue occuring on a specific device or browser?',
            integrations: 'Are there any specific integrations or third party systems involved?',
            troubleshooting: 'Have you attempted any troubleshooting steps, if so, what were they?',
        };

        let overlay = createOverlay();

        let title = document.createElement('h1');
        title.textContent = 'Please Select Questions';
        title.style.margin = 0;
        title.style.color = 'black';

        let questionContainer = document.createElement('div');
        questionContainer.id = 'questions';
        questionContainer.style.display = 'flex';
        questionContainer.style.gap = '5px';
        questionContainer.style.flexDirection = 'column';
        questionContainer.style.alignItems = 'flex-start';
        questionContainer.style.justifyContent = 'center';
        
        for (const question in quashQuestions) {
            let checkboxContainer = document.createElement('div');
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.gap = '5px';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.justifyContent = 'center';

            let questionCheckbox = document.createElement('input');
            questionCheckbox.id  = `question${question}`;
            questionCheckbox.type = 'checkbox';
            questionCheckbox.style.margin = 0;
            questionCheckbox.style.color = 'black';
    
            let questionLabel = document.createElement('label');
            questionLabel.textContent = quashQuestions[question];
            questionLabel.style.margin = 0;
            questionLabel.style.color = 'black';
            questionLabel.style.fontSize = '1.6rem';

            checkboxContainer.appendChild(questionCheckbox);
            checkboxContainer.appendChild(questionLabel);
            questionContainer.appendChild(checkboxContainer);
        }

        let nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.setAttribute('aria-label', 'Next');
        nextButton.style.padding = '2px 8px';
        nextButton.style.borderRadius = '1rem';
        nextButton.style.backgroundColor = 'lightGrey';
        nextButton.style.cursor = 'pointer';

        nextButton.addEventListener('click', () => {
            const questionList = [];
            for (const question in quashQuestions) {
                let current = document.getElementById(`question${question}`);

                if (current.checked) {
                    questionList.push(quashQuestions[question]);
                }
            }
            overlay.remove();
            displayTemplate(region, name, questionList);
        });

        overlay.appendChild(title);
        overlay.appendChild(questionContainer);
        overlay.appendChild(nextButton);
        document.body.appendChild(overlay);
    };

checkForExistingBookmarklets();
})();