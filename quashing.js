javascript:(function () {
    const checkForExistingBookmarklets = () => {
        const existingBookmarkletNodes = document.querySelectorAll(".bookMarklet");
    
        if (existingBookmarkletNodes.length) {
            for (const element in existingBookmarkletNodes) {
                if (element === 'entries') break;
                existingBookmarkletNodes[element].remove();
            }
            console.log('All elements have been cleared.');
            document.removeEventListener(`keydown`, initTrapFocus);
            return;
        }
        document.addEventListener(`keydown`, initTrapFocus);
        displayInfoContainer();
        document.getElementById('closeBtn').focus();
    };

    function initTrapFocus(e) {
        return trapFocus(e, `bookMarkletModal`);
    };

    const trapFocus = (e, modalId) => {
        const isTabPressed = e.key === `Tab` || e.keyCode === 9;
      
        if (!isTabPressed) {
          return;
        }
        const focusableElements = `button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])`;
        const modal = document.getElementById(modalId);
      
        const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
        const focusableContent = modal.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
      
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
          }
        } else if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
    };

    const createOverlay = () => {
        let overlay = document.createElement('div');
        overlay.id = 'bookMarkletModal';
        overlay.className = 'bookMarklet';
        overlay.style.position = 'fixed';
        overlay.style.top = '10%';
        overlay.style.left = '15%';
        overlay.style.minWidth = '500px';
        overlay.style.maxWidth = '600px';
        overlay.style.backgroundColor = '#C3C3C3';
        overlay.style.display = 'flex';
        overlay.style.gap = '5px';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.flexWrap = 'wrap';
        overlay.style.borderRadius  = '8px';
        overlay.style.padding  = '1rem';
        overlay.style.zIndex = '999';
        overlay.setAttribute('tabIndex', '-1');
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'modalTitle');

        let header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'flex-end';
        header.style.width = '100%';

        let closeBtn = createButton('X', 'lightGrey', 'Black');
        closeBtn.id = 'closeBtn';
        closeBtn.autofocus = true;
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.setAttribute('aria-label', 'Close Button');

        closeBtn.addEventListener('click', () => {
            document.removeEventListener(`keydown`, initTrapFocus);
            overlay.remove();
        });

        header.appendChild(closeBtn);
        overlay.appendChild(header);

        return overlay;
    };

    const createButton = (text, backgroundColor = 'lightGrey', textColor = 'black') => {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.cursor = 'pointer';
        button.style.backgroundColor = backgroundColor;
        button.style.color = textColor;
        button.style.borderRadius = '1rem';

        return button;
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

    const displayInfoContainer = () => {
        const regionOptions = ['NCSA', 'EMEA', 'APAC'];
        const featureOptions = ['General', 'Accessibility', 'Reporting', 'Tables', 'Cosmos'];
        let currentRegion = getLocalStorage('region');
        let currentName = getLocalStorage('name');
        const informationOptions = ['Yes', 'No'];

        let overlay = createOverlay();

        let title = document.createElement('h2');
        title.id = 'modalTitle';
        title.textContent = 'Quashing Template Generator';
        title.style.margin = 0;
        title.style.fontSize = '30px';
        title.style.color = 'black';

        let btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.justifyContent = 'center';
        btnContainer.style.gap = '1rem';

        let infoContainer = document.createElement('div');
        infoContainer.style.display = 'flex';
        infoContainer.style.flexDirection = 'column';
        infoContainer.style.gap = '.8rem';
        infoContainer.style.alignItems = 'flex-start';
        infoContainer.style.justifyContent = 'center';

        let regionContainer = document.createElement('div');
        regionContainer.style.display = 'flex';
        regionContainer.style.gap = '1.1rem';

        let dropdownLabel = document.createElement('h3');
        dropdownLabel.id = 'regionLabel';
        dropdownLabel.setAttribute('for', 'regionSelect');
        dropdownLabel.textContent = 'Region';
        dropdownLabel.style.color = 'Black';

        let selectElement = document.createElement('select');
        selectElement.name = 'regions';
        selectElement.id = 'regionSelect';
        selectElement.disabled = currentRegion;
        selectElement.required = true;
        selectElement.style.maxHeight = '36px';
        selectElement.setAttribute('aria-labelledby', 'regionLabel');

        

        regionOptions.map(option => {
            let newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;

            selectElement.appendChild(newOption);
        });

        regionContainer.appendChild(dropdownLabel);
        regionContainer.appendChild(selectElement);

        let featureContainer = document.createElement('div');
        featureContainer.style.display = 'flex';
        featureContainer.style.gap = '.7rem';

        let featureLabel = document.createElement('h3');
        featureLabel.id = 'featureLabel';
        featureLabel.setAttribute('for', 'featureSelect');
        featureLabel.textContent = 'Feature';
        featureLabel.style.color = 'Black';

        let featureDropdown = document.createElement('select');
        featureDropdown.name = 'features';
        featureDropdown.id = 'featureSelect';
        featureDropdown.style.maxHeight = '36px';
        featureDropdown.setAttribute('aria-labelledby', 'featureLabel');


        featureOptions.map(option => {
            let newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;

            featureDropdown.appendChild(newOption);
        });

        featureContainer.appendChild(featureLabel);
        featureContainer.appendChild(featureDropdown);

        let triageInfoContainer = document.createElement('div');
        triageInfoContainer.style.display = 'flex';
        triageInfoContainer.style.gap = '1rem';
        triageInfoContainer.style.flexDirection ='column';
        triageInfoContainer.style.alignItems = 'center';
        triageInfoContainer.style.justifyContent = 'center';
        triageInfoContainer.style.marginBottom = '1rem';

        let triageDropdownLabel = document.createElement('h3');
        triageDropdownLabel.id = 'triageLabel';
        triageDropdownLabel.setAttribute('for', 'informationToTriage');
        triageDropdownLabel.textContent = 'Did the client provide enough information to triage?';
        triageDropdownLabel.style.color = 'black';

        let triageSelectElement = document.createElement('select');
        triageSelectElement.name = 'informationSelection';
        triageSelectElement.id = 'informationToTriage';
        triageSelectElement.setAttribute('aria-labelledby', 'triageLabel');


        informationOptions.map(option => {
            let newOption = document.createElement('option');
            newOption.value = option;
            newOption.textContent = option;

            triageSelectElement.appendChild(newOption);
        });

        triageInfoContainer.appendChild(triageDropdownLabel);
        triageInfoContainer.appendChild(triageSelectElement);

        let nameContainer = document.createElement('div');
        nameContainer.style.display = 'flex';
        nameContainer.style.gap = '1.5rem';

        let inputLabel = document.createElement('h3');
        inputLabel.setAttribute('for', 'engineerName');
        inputLabel.textContent = 'Name';
        inputLabel.style.color = 'Black';


        let nameInput = document.createElement('input');
        nameInput.id = 'engineerName';
        nameInput.disabled = currentName;
        nameInput.type = 'text';
        nameInput.placeholder = !currentName ? 'Enter Name' : currentName;
        nameInput.style.maxHeight = '36px';

        nameContainer.appendChild(inputLabel);
        nameContainer.appendChild(nameInput);

        infoContainer.appendChild(regionContainer);
        infoContainer.appendChild(nameContainer);
        infoContainer.appendChild(featureContainer);
        infoContainer.appendChild(triageInfoContainer);

        let saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.setAttribute('aria-label', 'Save');
        saveBtn.disabled = currentName && currentRegion;
        saveBtn.style.padding = '2px 8px';
        saveBtn.style.borderRadius = '1rem';
        saveBtn.style.backgroundColor = 'lightGrey';
        saveBtn.style.cursor = 'pointer';
        saveBtn.style.color = 'Black';

        saveBtn.addEventListener('click', () => {
            let regionSelection = document.getElementById('regionSelect').value;

            if (!currentName) {
                let newName = document.getElementById('engineerName').value;
                if (!newName || !regionSelection) {
                    return alert('Both name and region are required');
                }
                setLocalStorage('name', newName);
                setLocalStorage('region', regionSelection);
                currentRegion = regionSelection;
                currentName = newName;
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
        resetBtn.style.color = 'Black';

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
        nextButton.style.color = 'Black';

        nextButton.addEventListener('click' , () => {
            let featureSelection = document.getElementById('featureSelect').value;
            let triageSelection = document.getElementById('informationToTriage').value;

            if (!currentName || !currentRegion) {
                return alert('Both name and region are required');
            }

            if (triageSelection === 'Yes') {
                overlay.remove();
                displayTemplate(currentRegion, currentName);
                document.getElementById('closeBtn').focus();
                return
            }

            overlay.remove();
            displayQuestions(currentRegion, currentName, featureSelection);
            document.getElementById('closeBtn').focus();
        });

        btnContainer.appendChild(saveBtn);
        btnContainer.appendChild(resetBtn);
        btnContainer.appendChild(nextButton);

        overlay.appendChild(title);
        overlay.appendChild(infoContainer);
        overlay.appendChild(btnContainer);
        document.body.prepend(overlay);
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
        title.id = 'modalTitle';
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

            let copyHashtags = document.createElement('button');
            copyHashtags.id = `copy${tag}`;
            copyHashtags.textContent = 'Copy';
            copyHashtags.setAttribute('aria-label', 'Copy Hashtag');
            copyHashtags.setAttribute('data-tag', tag);
            copyHashtags.title = `copy ${tag}`;
            copyHashtags.style.padding = '2px 8px';
            copyHashtags.style.borderRadius = '1rem';
            copyHashtags.style.backgroundColor = 'lightGrey';
            copyHashtags.style.color = 'Black';
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
        copyResponse.style.color = 'Black';
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
        document.body.prepend(overlay);
    };

    const displayQuestions = (region, name, featureSelection) => {
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

        const featureQuestions = {
            accessibility: [
                'What screen reader and version are you testing with?',
                'What navigation method is being used to test?',
                'Is there a specific WCAG success criteria being broken?'
            ],
            reporting: [
                'test1',
                'one1',
                'two1'
            ],
            tables: [
                'Is the table optimized or non-optimized?',
            ],
            cosmos: [
                'Are userPortal or pyCaseMainInner customized?',
                'Can you please revert the customized sections to test OOTB behavior?',
            ],
        };

        let overlay = createOverlay();

        let title = document.createElement('h1');
        title.id = 'modalTitle';
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

        let generalQuestionsTitle = document.createElement('h2');
        generalQuestionsTitle.textContent = 'General Questions';
        generalQuestionsTitle.style.placeSelf = 'flex-start';
        generalQuestionsTitle.style.margin = 0;
        generalQuestionsTitle.style.color = 'black';

        for (const question in quashQuestions) {
            let checkboxContainer = document.createElement('div');
            checkboxContainer.style.display = 'flex';
            checkboxContainer.style.gap = '5px';
            checkboxContainer.style.alignItems = 'center';
            checkboxContainer.style.justifyContent = 'center';

            let questionCheckbox = document.createElement('input');
            questionCheckbox.id = `checkbox-question${question}`;
            questionCheckbox.type = 'checkbox';
            questionCheckbox.style.margin = 0;
            questionCheckbox.style.color = 'black';
            questionCheckbox.setAttribute('aria-label', `${quashQuestions[question]}`);
    
            let questionLabel = document.createElement('label');
            questionLabel.id  = `question${question}`;
            questionLabel.textContent = quashQuestions[question];
            questionLabel.style.margin = 0;
            questionLabel.style.color = 'black';


            checkboxContainer.appendChild(questionCheckbox);
            checkboxContainer.appendChild(questionLabel);
            questionContainer.appendChild(checkboxContainer);
        }

        let featureContainer = document.createElement('div');
        featureContainer.id = 'featureQuestions';
        featureContainer.style.display = 'flex';
        featureContainer.style.gap = '5px';
        featureContainer.style.flexDirection = 'column';
        featureContainer.style.alignItems = 'flex-start';
        featureContainer.style.justifyContent = 'center';
        featureContainer.style.width = '100%';
        
        let featureQuestionsTitle = document.createElement('h2');
        featureQuestionsTitle.textContent = `${featureSelection} Specific Questions`;
        featureQuestionsTitle.style.placeSelf = 'flex-start';
        featureQuestionsTitle.style.margin = 0;
        featureQuestionsTitle.style.color = 'black';
        
        if (featureSelection != 'General') {
            for (const feature in featureQuestions) {
                if (feature.toLowerCase() === featureSelection.toLowerCase()) {
                    featureQuestions[feature].map(question => {
                        let checkboxContainer = document.createElement('div');
                        checkboxContainer.style.display = 'flex';
                        checkboxContainer.style.gap = '5px';
                        checkboxContainer.style.alignItems = 'center';
                        checkboxContainer.style.justifyContent = 'center';

                        let questionCheckbox = document.createElement('input');
                        questionCheckbox.id  = `feature${question}`;
                        questionCheckbox.type = 'checkbox';
                        questionCheckbox.style.margin = 0;
                        questionCheckbox.style.color = 'black';
                
                        let questionLabel = document.createElement('label');
                        questionLabel.textContent = question;
                        questionLabel.style.margin = 0;
                        questionLabel.style.color = 'black';

                        checkboxContainer.appendChild(questionCheckbox);
                        checkboxContainer.appendChild(questionLabel);
                        featureContainer.appendChild(checkboxContainer);
                    })
                }
            }
        }

        let nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.setAttribute('aria-label', 'Next');
        nextButton.style.padding = '2px 8px';
        nextButton.style.borderRadius = '1rem';
        nextButton.style.backgroundColor = 'lightGrey';
        nextButton.style.color = 'Black';
        nextButton.style.cursor = 'pointer';

        nextButton.addEventListener('click', () => {
            const questionList = [];
            for (const question in quashQuestions) {
                let current = document.getElementById(`checkbox-question${question}`);

                if (current.checked) {
                    questionList.push(quashQuestions[question]);
                }
            }

            featureQuestions[featureSelection.toLowerCase()]?.map(question => {
                let current = document.getElementById(`feature${question}`);
                console.log(question, current);

                if (current.checked) {
                    questionList.push(question);
                }
            });

            overlay.remove();
            displayTemplate(region, name, questionList);
            document.getElementById('closeBtn').focus();
            
        });

        overlay.appendChild(title);
        overlay.appendChild(generalQuestionsTitle);
        overlay.appendChild(questionContainer);
        featureSelection === 'General' ? null : overlay.appendChild(featureQuestionsTitle);
        overlay.appendChild(featureContainer);
        overlay.appendChild(nextButton);
        document.body.prepend(overlay);
    };

checkForExistingBookmarklets();
})();