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
        displayOverlay();
    };

    const displayOverlay = () => {
        let regionOptions = ['NCSA', 'EMEA', 'APAC'];
        let currentRegion = getLocalStorage('region');


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
    dropdownLabel.textContent = 'Please select your region';
    dropdownLabel.style.color = 'black';

    let selectElement = document.createElement('select');
    selectElement.name = 'regions';
    selectElement.id = 'regionSelect';

    regionOptions.map(option => {
        let newOption = document.createElement('option');
        newOption.value = option;
        newOption.textContent = option;

        selectElement.appendChild(newOption);
    });

    dropdownContainer.appendChild(dropdownLabel);
    dropdownContainer.appendChild(selectElement);

    let saveRegion = document.createElement('button');
    saveRegion.textContent = 'Next';
    saveRegion.style.padding = '2px 8px';
    saveRegion.style.borderRadius = '1rem';
    saveRegion.style.backgroundColor = 'grey';
    saveRegion.style.cursor = 'pointer';

    saveRegion.addEventListener('click' , () => {
        let regionSelection = document.getElementById('regionSelect').value;

        setLocalStorage('region', regionSelection);
    });

    let confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Close';
    confirmBtn.style.padding = '2px 8px';
    confirmBtn.style.borderRadius = '1rem';
    confirmBtn.style.backgroundColor = 'grey';
    confirmBtn.style.cursor = 'pointer';

    confirmBtn.addEventListener('click' , () => {
        overlay.remove();
    });

    btnContainer.appendChild(saveRegion);
    btnContainer.appendChild(confirmBtn);

    overlay.appendChild(title);
    overlay.appendChild(dropdownContainer);
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

    const templateGenerator = () => {

    };

checkForExistingBookmarklets();
})();