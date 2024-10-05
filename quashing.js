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

    const displayRegionSelect = () => {
        let regionOptions = ['NCSA', 'EMEA', 'APAC'];
        let currentRegion = getLocalStorage('region');
        let currentName = getLocalStorage('name');

        let overlay = document.createElement('div');
        overlay.className = 'bookMarklet';
        overlay.style.position = 'fixed';
        overlay.style.top = '20%';
        overlay.style.left = '35%';
        overlay.style.width = '30%';
        overlay.style.backgroundColor = '#f0f0f0';
        overlay.style.display = 'flex';
        overlay.style.gap = '5px';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.textAlign = 'center';
        overlay.style.borderRadius  = '8px';
        overlay.style.padding  = '1rem';

        let title = document.createElement('h2');
        title.textContent = 'Quashing Template Generator';
        title.style.color = 'black';

        let btnContainer = document.createElement('div');
        btnContainer.style.display = 'flex';
        btnContainer.style.alignItems = 'center';
        btnContainer.style.justifyContent = 'center';

        let dropdownContainer = document.createElement('div');
        dropdownContainer.style.display = 'flex';
        dropdownContainer.style.flexDirection ='column';
        dropdownContainer.style.alignItems = 'flex-start';
        dropdownContainer.style.justifyContent = 'center';

        let dropdownLabel = document.createElement('label');
        dropdownLabel.setAttribute('for', 'regionSelect');
        dropdownLabel.textContent = !currentRegion ? 'Please select your region' : 'Region already saved';
        dropdownLabel.style.color = 'black';

        let selectElement = document.createElement('select');
        selectElement.name = 'regions';
        selectElement.id = 'regionSelect';
        selectElement.disabled = currentRegion;

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
        nameInput.type = 'text';
        nameInput.placeholder = !currentName ? 'Enter Name' : currentName;

        let saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.disabled = currentName && currentRegion;
        saveBtn.style.padding = '2px 8px';
        saveBtn.style.borderRadius = '1rem';
        saveBtn.style.backgroundColor = 'grey';
        saveBtn.style.cursor = 'pointer';

        saveBtn.addEventListener('click' , () => {
            let regionSelection = document.getElementById('regionSelect').value;

            if (!currentName) {
                let newName = document.getElementById('engineerName').value;
                setLocalStorage('name', newName);
                setLocalStorage('region', regionSelection);
                currentName = newName;
            }
        });

        let nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.style.padding = '2px 8px';
        nextButton.style.borderRadius = '1rem';
        nextButton.style.backgroundColor = 'grey';
        nextButton.style.cursor = 'pointer';

        nextButton.addEventListener('click' , () => {
            overlay.remove();
            displayEnoughInformationToTriage(currentRegion, currentName);
        });

        btnContainer.appendChild(nextButton);

        overlay.appendChild(title);
        overlay.appendChild(dropdownContainer);
        overlay.appendChild(nameInput);
        overlay.appendChild(saveBtn);
        overlay.appendChild(btnContainer);
        document.body.appendChild(overlay);
    };

    const setLocalStorage = (name, param) => {
        console.log('setting' , name, param);
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

        let overlay = document.createElement('div');
        overlay.className = 'bookMarklet';
        overlay.style.position = 'fixed';
        overlay.style.top = '20%';
        overlay.style.left = '35%';
        overlay.style.width = '30%';
        overlay.style.backgroundColor = '#f0f0f0';
        overlay.style.display = 'flex';
        overlay.style.gap = '5px';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.textAlign = 'center';
        overlay.style.borderRadius  = '8px';
        overlay.style.padding  = '1rem';

        let dropdownContainer = document.createElement('div');
        dropdownContainer.style.display = 'flex';
        dropdownContainer.style.flexDirection ='column';
        dropdownContainer.style.alignItems = 'flex-start';
        dropdownContainer.style.justifyContent = 'center';

        let dropdownLabel = document.createElement('label');
        dropdownLabel.setAttribute('for', 'informationToTriage');
        dropdownLabel.textContent = 'Did the client provide enought information to triage?';
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
        nextButton.style.padding = '2px 8px';
        nextButton.style.borderRadius = '1rem';
        nextButton.style.backgroundColor = 'grey';
        nextButton.style.cursor = 'pointer';

        dropdownContainer.appendChild(dropdownLabel);
        dropdownContainer.appendChild(selectElement);
        dropdownContainer.appendChild(nextButton);

        overlay.appendChild(dropdownContainer);
        document.body.appendChild(overlay);

        nextButton.addEventListener('click', () => {
            const selection = document.getElementById('informationToTriage').value;

            if (selection === 'Yes') {
                displayTemplate(region, name);
            }
        })
    };

    const displayTemplate = (region, name) => {
        const quashTemplate = {
            responseNo: `Thank you for reaching out to Pega GCS Support, we are currently routing your request to the appropriate engineer for this request. You will be notified once an engineer has been assigned. Regards, ${name}`,
            selfTriaging: `#uxpx${region.toLowerCase()}-global #uxpxquashed`,
            triaging: `#uxpxquashed`
        };

        let overlay = document.createElement('div');
        overlay.className = 'bookMarklet';
        overlay.style.position = 'fixed';
        overlay.style.top = '20%';
        overlay.style.left = '35%';
        overlay.style.width = '30%';
        overlay.style.backgroundColor = '#f0f0f0';
        overlay.style.display = 'flex';
        overlay.style.gap = '5px';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.textAlign = 'center';
        overlay.style.borderRadius  = '8px';
        overlay.style.padding  = '1rem';

        let title = document.createElement('h3');
        title.textContent = 'Quashing Template';
        title.style.color = 'black';

        let template = document.createElement('p');
        template.id  = 'quashTemplate';
        template.textContent = quashTemplate.responseNo;
        template.style.color = 'black';

        let hashTags = document.createElement('p');
        hashTags.id  = 'quashTags';
        hashTags.textContent = quashTemplate.selfTriaging;
        hashTags.style.color = 'black';

        let copyResponse = document.createElement('button');
        copyResponse.textContent = 'Copy';
        copyResponse.style.padding = '2px 8px';
        copyResponse.style.borderRadius = '1rem';
        copyResponse.style.backgroundColor = 'grey';
        copyResponse.style.cursor = 'pointer';

        copyResponse.addEventListener('click', () => {
            const selection = document.getElementById('quashTemplate').textContent;

            navigator.clipboard.writeText(selection);
        });

        let copyHashtags = document.createElement('button');
        copyHashtags.textContent = 'Copy';
        copyHashtags.style.padding = '2px 8px';
        copyHashtags.style.borderRadius = '1rem';
        copyHashtags.style.backgroundColor = 'grey';
        copyHashtags.style.cursor = 'pointer';

        copyHashtags.addEventListener('click', () => {
            const selection = document.getElementById('quashTags').textContent;

            navigator.clipboard.writeText(selection);
        });


        overlay.appendChild(title);
        overlay.appendChild(template);
        overlay.appendChild(copyResponse);
        overlay.appendChild(hashTags);
        overlay.appendChild(copyHashtags);
        document.body.appendChild(overlay);
    };

checkForExistingBookmarklets();
})();