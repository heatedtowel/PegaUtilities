// ==UserScript==
// @name         vToolBar
// @description  ToolBar based in vue.js for streamlining housing various tools to streamline work in the GCS support portal
// @author       Dallin Andersen
// @match        https://pegasupport.pega.com/prweb/PRAuth/app/support/*
// @version      1.0.2
// @downloadURL  https://github.com/heatedtowel/PegaUtilities/raw/refs/heads/master/monkeyQuashing.user.js
// @updateURL    https://github.com/heatedtowel/PegaUtilities/raw/refs/heads/master/monkeyQuashing.user.js
// ==/UserScript==

/**
TODO - https://stackoverflow.com/questions/72545851/how-to-make-userscript-auto-update-from-private-domain-github
*/

/**
For icons we can get the svg downloads directly from fontawesome:
https://fontawesome.com/v6/search?o=r&m=free

This tool is leverage vue.js:
https://vuejs.org/
It can be used as a standalone script:
https://vuejs.org/guide/extras/ways-of-using-vue.html#standalone-script

Storage for some persistance of settings:
https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- namespace settings as "vTool{_Component}_Settings_{Setting}"
*/

let stylesText = `
#vueroot {
    --main-accent-color: rgb(27, 38, 84);
}

#vueroot {
}

#vueroot p, #vueroot div, #vueroot li, #vueroot span {
    color: black;
}

#vueroot .vmenu {
    display: flex;
    position: absolute;
    bottom: 5px;
    right: 12px;
    background-color: #53189A;
    background-color: #681FC3;
    background-color: var(--main-accent-color);
    padding: 5px;
    border-radius: 7px;
    color: white;
}

#vueroot .vmenu.vmenu--relative {
    position: relative;
    bottom: initial;
    right: initial;
    padding: 0px;
}

#vueroot .vmenuItem {
    transition: all 0.5s ease-out;
    fill: white;
    background-color: var(--main-accent-color);
    height: 32px;
    width: 32px;
    padding: 5px;
    display: grid;
    vertical-align: middle;
    justify-items: center;
    align-items: center;
    border-radius: 4px;
}

#vueroot .vmenuItem:hover, #vueroot .vmenuItem.selected {
    fill: var(--main-accent-color);
    background-color: white;
}

#vueroot .vcontent {
    position: absolute;
    bottom: 52px;
    right: 12px;
    width: 375px;
    background-color: #53189A;
    background-color: #681FC3;
    background-color: var(--main-accent-color);
    padding: 5px;
    border-radius: 7px;
    color: white;
    z-index: 500;
}

#vueroot .vcontent h2 {
    width: 100%;
}

#vueroot .vcontent hr {
    margin: 5px;
}

#vueroot .vcontent input, #vueroot .vcontent select {
    color: black;
}

#vueroot .vcontent label {
    margin-right: 5px;
}

#vueroot .vcontentpane {

}

#vueroot .vinfospan {
    width: 16px;
    display: block;
    float: left;
    margin-right: 0px;
    fill: white;
}

#vueroot .vinfospan:hover {
    cursor: help;
}

#vueroot .vcopytext {
    background-color: white;
    padding: 5px;
    max-height: 300px;
    overflow-y: scroll;
}

#vueroot .vcopytext:hover {
    cursor: copy;
}

#vueroot .vcopytext span {
    color: var(--main-accent-color);
    white-space: pre-line;
}

#vueroot .voverflowPane {
    max-height: 200px;
    overflow-y: scroll;
}

#vueroot .vtabPane {
}

#vueroot .vtabPane__tabs {
    display: flex;
    font-weight: bold;
}

#vueroot .vtabPane__tab {
    transition: all 0.5s ease-out;
    padding: 5px;
    border: 1px solid white;
    margin: 5px;
    display: grid;
    align-items: center;
}

#vueroot .vtabPane__tab:hover {
    cursor: pointer;
}

#vueroot .vtabPane__tab:hover, #vueroot .vtabPane__tab.vtabPane__tab--selected {
    color: var(--main-accent-color);
    background-color: white;
}

#vueroot .vtabPane__tab.vtabPane__tab--selected:hover {
    cursor: initial;
}

#vueroot .vtabPane__content  {
}

#vueroot .verror  {
    background-color: red;
    border: 1px solid darkred;
}

#vueroot .vcopytag  {
    padding: 0px 7px;
    border-radius: 12px;
    border: 1px solid white;
    display: inline-block;
    background-color: white;
    color: var(--main-accent-color);
    margin-right: 5px;
    margin-top: 3px;
}

#vueroot .vcopytag:hover  {
    cursor: copy;
}

#vueroot ol  {
    padding-left: 25px;
}
`;

(function() {
    'use strict';

    // Setup the Vue App root element
    let overlay = document.createElement('div');
    overlay.id = "vueroot";
    overlay.innerHTML = "Hello World";
    let body = document.querySelector('body');
    body.appendChild(overlay);

    // Load the vue distribution
    let vuescript = document.createElement("script");
    vuescript.src = "https://unpkg.com/vue@3/dist/vue.global.js";
    vuescript.onload = vueScriptLoaded;
    document.head.appendChild(vuescript);

    // Load the stylings
    let styles = document.createElement('style');
    styles.innerHTML = stylesText;
    document.head.appendChild(styles);

})();

function vueScriptLoaded(event) {
    setupVueRoot()
}


/** ------------------------------------------------------ ------------------------------------------------------
** Vue App Root
*   ------------------------------------------------------ ------------------------------------------------------ */

// component names
const TOOL_INFORMATION = 'Tool Information'
const TOOL_SETTINGS = 'Tool Settings'
const QUASHING = 'Quashing'

// settings - localstorage keys
const VTOOL_SETTINGS_ENGINEERNAME = 'vTool_Settings_engineerName'
const VTOOL_SETTINGS_ENGINEERREGION = 'vTool_Settings_engineerRegion'

function setupVueRoot() {

    const { createApp } = Vue

    createApp({
        components: {
            ToolInformation_Component,
            Quashing_Component
        },
        mounted() {
            let engineerName = localStorage.getItem(VTOOL_SETTINGS_ENGINEERNAME)
            let engineerNameUI = document.querySelector("button[data-test-id='px-opr-image-ctrl']").title;
            this.settings.engineerName = (engineerName ? engineerName : (engineerNameUI ? engineerNameUI : ''))

            let engineerRegion = localStorage.getItem(VTOOL_SETTINGS_ENGINEERREGION)
            let engineerRegionUI = '';
            let offset = new Date().getTimezoneOffset();
            if (offset >= 180 && offset <= 660) engineerRegionUI = 'NCSA'
            else if (offset > 660 || offset < -300) engineerRegionUI = 'APAC'
            else if (offset >= -300 && offset < 180) engineerRegionUI = 'EMEA'
            this.settings.engineerRegion = (engineerRegion ? engineerRegion : (engineerRegionUI ? engineerRegionUI : ''))
        },
        watch: {
          'settings.engineerName'() {
              localStorage.setItem(VTOOL_SETTINGS_ENGINEERNAME, this.settings.engineerName)
          },
          'settings.engineerRegion'() {
              localStorage.setItem(VTOOL_SETTINGS_ENGINEERREGION, this.settings.engineerRegion)
          }
        },
        data() {
            return {
                message: 'Hello Vue!',
                menu: {
                    closed: true,
                    openMenuIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>',
                    closeMenuIcon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>',
                    currentSelection: '',

                    items: {
                        [TOOL_INFORMATION]: {
                            title: TOOL_INFORMATION,
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
                            other: 'asdfasdfasdfasdf Tool info other'
                        },
                        [TOOL_SETTINGS]: {
                            title: TOOL_SETTINGS,
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>',
                            other: 'asdfasdfasdfasdf Tool info other',
                            regionOptions: ['NCSA', 'EMEA', 'APAC']
                        },
                        [QUASHING]: {
                            title: QUASHING,
                            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z"/></svg>',
                            other: 'hhhhh'
                        }
                    },
                },
                settings: {
                    engineerName: '',
                    engineerRegion: ''
                }
            }
        },
        template: `
<div>
  <div class="vmenu">
    <div class="vmenuItem" v-html="menu.openMenuIcon" v-if="menu.closed" v-on:click="menu.closed=false" title="Open Menu"></div>
    <div v-if="!menu.closed" v-for="(item, key) in menu.items" class="vmenuItem" :class="{ selected: menu.currentSelection==key}" v-html="item.icon" v-on:click="(menu.currentSelection==key) ? menu.currentSelection='' : menu.currentSelection=key" :title="key"></div>
    <div class="vmenuItem" v-html="menu.closeMenuIcon" v-if="!menu.closed" v-on:click="menu.closed=true" title="Close Menu"></div>
  </div>
  <div class="vcontent" v-if="!menu.closed && menu.currentSelection != ''">
    <h2>{{menu.currentSelection}}</h2>
    <hr>
    <div class="vcontentpane" v-if="menu.currentSelection == '${TOOL_INFORMATION}'">
      <ToolInformation_Component />
    </div>
    <div class="vcontentpane" v-if="menu.currentSelection == '${TOOL_SETTINGS}'">
    <form>
      <label>Engineer Name</label>
      <input v-model="settings.engineerName"><br />
      <label>Engineer Region</label>
      <select v-model="settings.engineerRegion">
        <option disabled value="">Please select one</option>
        <option v-for="item in menu.items['${TOOL_SETTINGS}'].regionOptions">{{ item }}</option>
      </select><br />
    </form>
    </div>
    <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING}'">
      <Quashing_Component />
    </div>
  </div>
</div>
        `
    }).mount('#vueroot')
}


/** ------------------------------------------------------ ------------------------------------------------------
** COMPONENT - Tool Information -- and subcomponents
*   ------------------------------------------------------ ------------------------------------------------------ */

let ToolInformation_Component = {
  data() {
    return {
      count: 0
    }
  },
  template: `
<p>This tool is to help streamline various tasks within the Support Portal. Please submit feedback to Dallin.Andersen@pega.com and Jesse.Monks@pega.com</p>

    `
}


/** ------------------------------------------------------ ------------------------------------------------------
** COMPONENT - Tool Settings -- and subcomponents
*   ------------------------------------------------------ ------------------------------------------------------ */

/**let ToolSettings_Component = {
  data() {
    return {
      count: 0
    }
  },
  template: `
<div>
  <input v-model="engineerName">
  <p>General settings</p>
</div>

    `
}*/


/** ------------------------------------------------------ ------------------------------------------------------
** COMPONENT - Quashing -- and subcomponents
*   ------------------------------------------------------ ------------------------------------------------------ */

let Quashing_Objectives_Component = {
    data() {
        return {
            things: "asdf and things"
        }
    },
    template: `
<div>
  <ol>
    <li>Ensure the feature-impacted is correct</li>
    <li>Ensure the ticket is in the correct queue (This is dependent on the feature-impacted being correct)</li>
    <li>Verify that we have the required information from the client to start review</li>
    <li>Resolve Quick Kills</li>
    <li>Drain the Quash Queue by the end of your work day</li>
  </ol>
</div>
    `
}

const QUASHING__OBJECTIVES = 'Quashing - Objectives';
const QUASHING__CONFIRM_FEATUREIMPACTED = 'Quashing - Confirm Feature Impacted';
const QUASHING__CONFIRM_TRIBE = 'Quashing - Confirm Tribe';
const QUASHING__ACQUIRE_INFORMATION = 'Quashing - Acquire Information';
const QUASHING__QUICK_KILLS = 'Quashing - Quick Kills';
const QUASHING__DRAIN_QUEUE = 'Quashing - Drain Queue';
const QUASHING__TAGS = 'Quashing - Tags';
const QUASHING__QUASH_QUEUE_REPORT = 'Quashing - Quash Queue Report';

const QUASHING__F__GENERAL = 'General';
const QUASHING__F__CONSTELLATION_UI__GENERAL = 'Constellation UI -> General';
const QUASHING__F__CONSTELLATION_UI__ACCESSIBILITY = 'Constellation UI -> Accessibility';
const QUASHING__F__CONSTELLATION_UI__CONSTELLATION_DX_COMPONENTS = 'Constellation UI -> Constellation DX Components';
const QUASHING__F__MOBILITY__GENERAL = 'Mobility -> General';
const QUASHING__F__CUSTOMER_SERVICE__GENERAL = 'Customer Service -> General';
const QUASHING__F__PEGACLOUD__GENERAL = 'PegaCloud -> General';
const QUASHING__F__REPORTING_AND_INSIGHTS__GENERAL = 'Reporting & Insights -> General';
const QUASHING__F__THEME_COSMOS__GENERAL = 'Theme Cosmos -> General';
const QUASHING__F__USER_INTERFACE_UI__GENERAL = 'User Interface (UI) -> General';
const QUASHING__F__USER_INTERFACE_UI__ACCESSIBILITY = 'User Interface (UI) -> Accessibility';
const QUASHING__F__USER_INTERFACE_UI__TABLEGRID_LAYOUT = 'User Interface (UI) -> Table/Grid Layout';

// settings - localstorage keys
const VTOOL_QUASHING_SETTINGS_CURRENTSELECTION = 'vTool_Quashing_Settings_CurrentSelection'
const VTOOL_QUASHING_SETTINGS_CASETOQUASH = 'vTool_Quashing_Settings_CaseToQuash'

let Quashing_Component = {
    components: {
        Quashing_Objectives_Component
    },
    mounted() {
        let vueContext = this

        // Get current open content pane
        let currentSelection = localStorage.getItem(VTOOL_QUASHING_SETTINGS_CURRENTSELECTION)
        this.menu.currentSelection = (currentSelection ? currentSelection : QUASHING__OBJECTIVES)

        // Get current Open Cases
        var iframes = globalThis.document.getElementsByTagName("iframe");
        for(var i = 0; i < iframes.length; i++) {
            if (iframes[i].contentDocument.querySelector("body").ariaLabel) {
                let caseID = iframes[i].contentDocument.querySelector("body").ariaLabel.split(" ")[1];
                this.addCaseToAvailableCases(caseID)
            }
        }

        // Observe for new iframes to be loaded, and for tabs to be closed
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "childList" && mutation.removedNodes.length && mutation.removedNodes[0].nodeName == "IFRAME") {
                    // A Tab closed and the case should be removed from the available list
                    let removedCase = mutation.removedNodes[0].title;
                    //console.log(`The iframe '${removedCase}' has been removed.`);
                    let indexToRemove = vueContext.settings.availableCases.indexOf(removedCase);
                    if (indexToRemove == -1) continue;
                    vueContext.settings.availableCases.splice(indexToRemove, 1);
                } else if (mutation.type === "attributes" && mutation.attributeName == "title" && mutation.target.tagName == "IFRAME") {
                    // A New tab iframe was loaded and the case should be added to the available list
                    //console.log(`The ${mutation.attributeName} attribute of the iframe was modified to ${mutation.target.title}.`);
                    if (vueContext.settings.availableCases.includes(mutation.target.title)) continue
                    vueContext.addCaseToAvailableCases(mutation.target.title)
                }
            }
        };
        const observer = new MutationObserver(callback);
        let iframesParent = document.getElementById("PEGA_TABBED0");
        observer.observe(iframesParent, { attributes: true, childList: true, subtree: true });

        // Get current 'case to quash' selection
        let caseToQuash = localStorage.getItem(VTOOL_QUASHING_SETTINGS_CASETOQUASH)
        this.settings.caseToQuash = ((caseToQuash && this.settings.availableCases.includes(caseToQuash)) ? caseToQuash : '')

    },
    watch: {
        'menu.currentSelection'() {
            localStorage.setItem(VTOOL_QUASHING_SETTINGS_CURRENTSELECTION, this.menu.currentSelection)
        },
        'settings.caseToQuash'() {
            localStorage.setItem(VTOOL_QUASHING_SETTINGS_CASETOQUASH, this.settings.caseToQuash)
            this.getCaseInformation()
        }
    },
    computed: {
        fullFeatureName() {
            return this.caseInfo.parentFeatureName + ' -> ' + this.caseInfo.childFeatureName;
        },
        engineerRegion() {
            return localStorage.getItem(VTOOL_SETTINGS_ENGINEERREGION)
        },
        engineerRegionLC() {
            return localStorage.getItem(VTOOL_SETTINGS_ENGINEERREGION).toLowerCase()
        },
        otherRegionsText() {
            let regions = ['NCSA', 'EMEA', 'APAC']
            let currentRegion = localStorage.getItem(VTOOL_SETTINGS_ENGINEERREGION)
            let index = regions.indexOf(currentRegion)
            if (index !== -1) {
                regions.splice(index, 1)
            }
            return regions.join(", ")
        },
        enoughInfoPresentMessage() {
            return `Hey ${this.caseInfo.clientName},

Thank you for reaching out to Pega GCS Support! We are currently routing your request to the appropriate engineer for this request.

You will be notified once an engineer has been assigned.

Regards,
${localStorage.getItem(VTOOL_SETTINGS_ENGINEERNAME)}`
        },
        needInfoMessage() {
            return `Hey ${this.caseInfo.clientName},

Thank you for reaching out to Pega GCS Support! We are currently routing your request to the appropriate engineer for this request.

Meanwhile please assist with the following to help expedite a resolution.

${this.questionsList}

Regards,
${localStorage.getItem(VTOOL_SETTINGS_ENGINEERNAME)}`
        },
        questionsList() {
            let currentQuestionNumber = 1;
            let text = '';
            for (let i = 0; i < this.acquireInfo.questions.General.length; i++) {
                if (this.acquireInfo.questions.General[i].selected == false) continue
                if (text != '') text += '\n'
                text += currentQuestionNumber++ + '. ' + this.acquireInfo.questions.General[i].text
            }
            if (this.fullFeatureName) {
                if (this.acquireInfo.questions[this.fullFeatureName] == undefined) {
                    this.error = `There are no standard questions suggested for this feature: '${this.fullFeatureName}'`
                } else {
                    this.error = ''
                    for (let i = 0; i < this.acquireInfo.questions[this.fullFeatureName].length; i++) {
                        if (this.acquireInfo.questions[this.fullFeatureName][i].selected == false) continue
                        if (text != '') text += '\n'
                        text += currentQuestionNumber++ + '. ' + this.acquireInfo.questions[this.fullFeatureName][i].text
                    }
                }
            }
            return text;
        }
    },
    data() {
        return {
            menu: {
                currentSelection: QUASHING__OBJECTIVES,
                items: {
                    [QUASHING__OBJECTIVES]: {
                        title: QUASHING__OBJECTIVES,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>',
                        other: 'asdfasdfasdfasdf Tool info other'
                    },
                    [QUASHING__QUASH_QUEUE_REPORT]: {
                        title: QUASHING__QUASH_QUEUE_REPORT,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 0l0 64 64 0 0-64L64 96zm384 0L192 96l0 64 256 0 0-64zM64 224l0 64 64 0 0-64-64 0zm384 0l-256 0 0 64 256 0 0-64zM64 352l0 64 64 0 0-64-64 0zm384 0l-256 0 0 64 256 0 0-64z"/></svg>',
                        other: 'hhhhh'
                    },
                    [QUASHING__CONFIRM_FEATUREIMPACTED]: {
                        title: QUASHING__CONFIRM_FEATUREIMPACTED,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM184 296c0 13.3 10.7 24 24 24s24-10.7 24-24l0-64 64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-64 0 0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64-64 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l64 0 0 64z"/></svg>',
                        other: 'hhhhh'
                    },
                    [QUASHING__CONFIRM_TRIBE]: {
                        title: QUASHING__CONFIRM_TRIBE,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm306.7 69.1L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>',
                        other: 'hhhhh'
                    },
                    [QUASHING__ACQUIRE_INFORMATION]: {
                        title: QUASHING__ACQUIRE_INFORMATION,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM105.8 229.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L216 328.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM160 416a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
                        other: 'hhhhh'
                    },
                    [QUASHING__QUICK_KILLS]: {
                        title: QUASHING__QUICK_KILLS,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z"/></svg>',
                        other: 'hhhhh'
                    },
                    [QUASHING__DRAIN_QUEUE]: {
                        title: QUASHING__DRAIN_QUEUE,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M224 0c17.7 0 32 14.3 32 32l0 12 96-12c17.7 0 32 14.3 32 32s-14.3 32-32 32L256 84l-31-3.9-1-.1-1 .1L192 84 96 96C78.3 96 64 81.7 64 64s14.3-32 32-32l96 12 0-12c0-17.7 14.3-32 32-32zM0 224c0-17.7 14.3-32 32-32l96 0 22.6-22.6c6-6 14.1-9.4 22.6-9.4l18.7 0 0-43.8 32-4 32 4 0 43.8 18.7 0c8.5 0 16.6 3.4 22.6 9.4L320 192l32 0c88.4 0 160 71.6 160 160c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32s-14.3-32-32-32l-36.1 0c-20.2 29-53.9 48-91.9 48s-71.7-19-91.9-48L32 320c-17.7 0-32-14.3-32-32l0-64zM436.8 423.4c1.9-4.5 6.3-7.4 11.2-7.4s9.2 2.9 11.2 7.4l18.2 42.4c1.8 4.1 2.7 8.6 2.7 13.1l0 1.2c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-1.2c0-4.5 .9-8.9 2.7-13.1l18.2-42.4z"/></svg>',
                        other: 'hhhhh'
                    },
                    [QUASHING__TAGS]: {
                        title: QUASHING__TAGS,
                        icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8L197.8 128l95.1 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8L357.8 128l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0L325.8 320l58.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-68.9 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7-95.1 0-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8L90.2 384 32 384c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 21.3-128L64 192c-17.7 0-32-14.3-32-32s14.3-32 32-32l68.9 0 11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zM187.1 192L165.8 320l95.1 0 21.3-128-95.1 0z"/></svg>',
                        other: 'hhhhh'
                    }
                },
            },
            caseInfo: {
                clientName: '',
                parentFeatureName: '',
                childFeatureName: ''
            },
            acquireInfo: {
                enoughInfoPresent: true,
                showGeneralQuestions: true,
                questions: {
                    [QUASHING__F__GENERAL]: [
                        { selected: false, text: 'Is the section being used customized from OOTB?' },
                        { selected: false, text: 'Please provide a Pega trace of the working / non-working scenario, if possible.' },
                        { selected: false, text: 'Is this happening in all environments? ex. Production, Dev, Testing?' },
                        { selected: false, text: 'Can you provide images or screenshots?' },
                        { selected: false, text: 'When did this issue first occur?' },
                        { selected: false, text: 'Is this issue recurring, or did it only happen once?' },
                        { selected: false, text: 'Has anything changed in the environment recently? ex. Updates, new integrations, configuration changes?' },
                        { selected: false, text: 'Are all users or departments affected?' },
                        { selected: false, text: 'Is there a specific error message or code?' },
                        { selected: false, text: 'Is this issue occuring on a specific device or browser?' },
                        { selected: false, text: 'Are there any specific integrations or third party systems involved?' },
                        { selected: false, text: 'Have you attempted any troubleshooting steps, if so, what were they?' }
                    ],
                    [QUASHING__F__CONSTELLATION_UI__GENERAL]: [
                    ],
                    [QUASHING__F__CONSTELLATION_UI__ACCESSIBILITY]: [
                        { selected: false, text: 'What screen reader and version are you testing with?' },
                        { selected: false, text: 'What navigation method is being used to test?' },
                        { selected: false, text: 'Is there a specific WCAG success criteria being broken?' },
                        { selected: false, text: 'Can you provide a video of the issue in detail?' }
                    ],
                    [QUASHING__F__CONSTELLATION_UI__CONSTELLATION_DX_COMPONENTS]: [
                    ],
                    [QUASHING__F__MOBILITY__GENERAL]: [
                        { selected: false, text: 'Mobility Question 1' },
                        { selected: false, text: 'Mobility Question 2' }
                    ],
                    [QUASHING__F__CUSTOMER_SERVICE__GENERAL]: [
                    ],
                    [QUASHING__F__PEGACLOUD__GENERAL]: [
                    ],
                    [QUASHING__F__REPORTING_AND_INSIGHTS__GENERAL]: [
                        { selected: false, text: 'reporting question 1' },
                        { selected: false, text: 'reporting question 2' },
                        { selected: false, text: 'reporting question 3' },
                        { selected: false, text: 'reporting question 4' }
                    ],
                    [QUASHING__F__THEME_COSMOS__GENERAL]: [
                        { selected: false, text: 'Are userPortal or pyCaseMainInner customized?' },
                        { selected: false, text: 'Can you please revert the customized sections to test OOTB behavior?' }
                    ],
                    [QUASHING__F__CONSTELLATION_UI__GENERAL]: [
                        { selected: false, text: 'Constellation Question 1' },
                        { selected: false, text: 'Constellation Question 2' }
                    ],
                    [QUASHING__F__USER_INTERFACE_UI__ACCESSIBILITY]: [
                        { selected: false, text: 'What screen reader and version are you testing with?' },
                        { selected: false, text: 'What navigation method is being used to test?' },
                        { selected: false, text: 'Is there a specific WCAG success criteria being broken?' },
                        { selected: false, text: 'Can you provide a video of the issue in detail?' }
                    ],
                    [QUASHING__F__USER_INTERFACE_UI__TABLEGRID_LAYOUT]: [
                        { selected: false, text: 'Is the table optimized or non-optimized?' }
                    ]
                }
            },
            settings: {
                caseToQuash: '',
                availableCases: [],
                explainCasesDropdown: false
            },
            error: ''
        }
    },
    methods: {
        addCaseToAvailableCases(caseToAdd) {
            if (caseToAdd.indexOf('INC-') != 0) return;
            this.settings.availableCases.push(caseToAdd)
        },
        getCaseInformation() {
            // Get the iframe of the case
            var iframe = document.querySelector(`iframe[title='${this.settings.caseToQuash}']`)
            if (!iframe) return;
            console.dir(iframe)

            // Get the client name
            var clientName = "____";
            clientName = iframe.contentDocument.querySelectorAll("[node_name=ClientContactPartyDetails]");
            for (var i = 0; i < clientName.length; i++) {
                if (clientName[i].parentNode.style.display == "none") {continue}
                clientName = clientName[i].querySelector(".standard").innerText;
                break;
            }
            this.caseInfo.clientName = clientName

            // Get the feature name
            var parentFeatureName = "____";
            var childFeatureName = "____";
            var featureNameDivArray = iframe.contentDocument.querySelectorAll("div[node_name='FeatureImpactedInDetails']");
            if (featureNameDivArray.length) {
                parentFeatureName = featureNameDivArray[0].childNodes[1].childNodes[0].innerText;
                childFeatureName = featureNameDivArray[0].childNodes[1].childNodes[2].innerText;
            } /*else {
                parentFeatureName = "FeatureName was not yet loaded, please try again"
            }*/
            this.caseInfo.parentFeatureName = parentFeatureName
            this.caseInfo.childFeatureName = childFeatureName

            // Get other needed information
            // ...
        },
        copyBaseToClipboard() {
            navigator.clipboard.writeText(this.enoughInfoPresentMessage)
        },
        copyQuestionsToClipboard() {
            navigator.clipboard.writeText(this.needInfoMessage)
        },
        copyToClipboard(valueToCopy) {
            navigator.clipboard.writeText(valueToCopy)
        }
    },
    template: `
<div>
  <div class="vcontentpane" v-if="menu.currentSelection != '${QUASHING__OBJECTIVES}'">
    <form>
      <p v-if="settings.explainCasesDropdown">Note: if you do not see your Case, it is not opened in a tab or its iframe has not been loaded. Navigate to the case tab to allow the iframe load.</p>
      <label><span v-on:click="settings.explainCasesDropdown = !settings.explainCasesDropdown" class="vinfospan"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3l58.3 0c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24l0-13.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1l-58.3 0c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg></span>Case To Quash</label>
      <select v-model="settings.caseToQuash">
        <option disabled value="">Please select one</option>
        <option v-for="item in settings.availableCases">{{ item }}</option>
      </select><br />
    </form>
  </div>
  <hr v-if="menu.currentSelection != '${QUASHING__OBJECTIVES}'">
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__OBJECTIVES}'">
    <h4>${QUASHING__OBJECTIVES}</h4>
    <Quashing_Objectives_Component />
  </div>
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__QUASH_QUEUE_REPORT}'">
    <h4>${QUASHING__QUASH_QUEUE_REPORT}</h4>
    <p>The following are steps to setup a report to view the current Quash Queue:</p>
    <ol>
      <li>Pega Support Portal</li>
      <li>Open Tickets Dashboard</li>
      <li>Open "Owner" column filters</li>
      <li>Apply "GCS-Quash-User and Product Experience" filter</li>
      <li>Save as new view "UI Quash"</li>
    </ol>
  </div>
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__CONFIRM_FEATUREIMPACTED}'">
    <h4>${QUASHING__CONFIRM_FEATUREIMPACTED}</h4>
    <p>Review the details of the ticket, and verify that the feature impacted reflects the issue in the ticket. If the feature impacted is not correct:</p>
    <ol>
      <li>Start the “Review case (Triage)” assignment</li>
      <li>Update the “Feature Impacted” field</li>
      <li>Save</li>
    </ol>
  </div>
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__CONFIRM_TRIBE}'">
    <h4>${QUASHING__CONFIRM_TRIBE}</h4>
    <p>If the feature impacted had to be updated, it is possible that the correct owners are in a different tribe.</p>
    <p>If you KNOW which tribe should own the ticket then transfer it to the appropriate GCS quash queue.</p>
    <p>If you are not certain which tribe should own the ticket:</p>
    <ol>
      <li>Create a Webex space for the INC
        <ol type="a">
          <li>Open INC-XXXXXX > Actions > Create Webex Space</li>
          <li>Connect your Webex account (if not already done)</li>
          <li>Submit</li>
          <li>Open Webex and find your newly created space</li>
        </ol>
      </li>
      <li>Add the Tribe leads to the Webex Space (For the tribes you believe should take the case forward)
        <ol type="a">
          <li>Find the correct tribe on <a href="https://knowledgehub.pega.com/GCS:Gcs-alliances" target="_blank">GCS Org Structure</a> and open their page</li>
          <li>Locate the Tribe leads at the top</li>
          <li>In the new Webex space, add these Tribe leads</li>
        </ol>
      </li>
      <li>Provide your analysis in the Webex space for the Tribe leads to review
        <ol type="a">
          <li>Include related evidence (screenshots, tracer files, har files, log files, etc)</li>
          <li>Describe why you believe the evidence points to the issue being in the new tribe</li>
          <li>Answer any questions from the tribe leads</li>
        </ol>
      </li>
      <li>If the tribe leads provide confirmation, route the ticket to the new tribe</li>
    </ol>
    <p>Note that this process can also be done through the Case Transfers Webex Space.</p>
  </div>
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__ACQUIRE_INFORMATION}'">
    <h4>${QUASHING__ACQUIRE_INFORMATION}</h4>
    <p>If the ticket does belong to your tribes queue:</p>
    <ol>
      <li>Ask the client for the necessary information (Use the template tool below to assist with this)</li>
      <li>Start the “Review case (Triage)” assignment</li>
      <li>Complete the quashing assignment, transferring the case to the work queue "GCS-User and Product Experience"</li>
      <li>Add the quashed tag to the ticket <span class="vcopytag" v-on:click="copyToClipboard('#uxpxquashed')" >#uxpxquashed</span></li>
    </ol>
    <input type="checkbox" v-model="acquireInfo.enoughInfoPresent"></input><label>Enough Information In Ticket</label><br />
    <div class="vcopytext" v-on:click="copyBaseToClipboard" v-if="acquireInfo.enoughInfoPresent">
      <span>{{ enoughInfoPresentMessage }}</span>
    </div>
    <div class="verror" v-if="error != ''">{{ error }}</div>
    <div v-if="!acquireInfo.enoughInfoPresent">
      <div class="vcopytext" v-on:click="copyQuestionsToClipboard">
        <span>{{ needInfoMessage }}</span>
      </div>
      <div class="vtabPane">
        <div class="vtabPane__tabs">
          <div class="vtabPane__tab" :class="{ 'vtabPane__tab--selected': acquireInfo.showGeneralQuestions == true }" v-on:click="acquireInfo.showGeneralQuestions = true">General</div>
          <div class="vtabPane__tab" :class="{ 'vtabPane__tab--selected': acquireInfo.showGeneralQuestions == false }" v-on:click="acquireInfo.showGeneralQuestions = false">{{ fullFeatureName }}</div>
        </div>
        <div class="vtabPane__content voverflowPane">
          <span v-if="acquireInfo.showGeneralQuestions == true" v-for="question in acquireInfo.questions.General"><input type="checkbox" v-model="question.selected"></input><label>{{ question.text }}</label><br /></span>
          <span v-if="acquireInfo.showGeneralQuestions == false" v-for="question in acquireInfo.questions[fullFeatureName]"><input type="checkbox" v-model="question.selected"></input><label>{{ question.text }}</label><br /></span>
        </div>
      </div>
    </div>
  </div>
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__QUICK_KILLS}'">
    <h4>${QUASHING__QUICK_KILLS}</h4>
    <p>If the ticket does belong to your tribes queue:</p>
    <ol>
      <li>Review GCS Buddy recommendations and other similar incidents</li>
      <li>Verify if the clients query/issue is known and has a ready answer/solution.
        <ol type="a">
          <li>If yes, provide the answer to the client and take ownership of the case</li>
          <li>If no, provide internal notes on your relevant findings that may help an engineer review the case faster, then transfer to the work queue "GCS-User and Product Experience"</li>
        </ol>
      </li>
    </ol>
    <p>If the ticket belongs to your tribes' queue, but to a different region ({{ otherRegionsText }}), when you take ownership add the following tag</p>
    <span class="vcopytag" v-on:click="copyToClipboard('#uxpx'+engineerRegionLC+'-global')" >#uxpx{{ engineerRegionLC }}-global</span>
    <p>Note: If after taking ownership, the case was not resolved as expected, you can chat with your manager about reassignment, as would be done for a case in the work queue.</p>
    <p>If you are returning a case to the queue that belongs to a different region add the following tag:</p>
    <span class="vcopytag" v-on:click="copyToClipboard('#uxpx'+engineerRegionLC+'-return')" >#uxpx{{ engineerRegionLC }}-return</span>
  </div>
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__DRAIN_QUEUE}'">
    <h4>${QUASHING__DRAIN_QUEUE}</h4>
    <p>Many different approaches are acceptable, but it is recommended to block off portions of your day in your calendar to dedicate to quashing, and to benefit from the related reminders.</p>
    <p>If you are unable to drain the quash queue for any reason at the end of your day, please note the details that blocked you from draining the queue in the <b>“GCS - UXPX - Quash Queue Squad”</b> Webex space and prep the Quashing engineer in the next region for the tickets they are inheriting from your shift.</p>
  </div>
  <div class="vcontentpane" v-if="menu.currentSelection == '${QUASHING__TAGS}'">
    <h4>${QUASHING__TAGS}</h4>
    <p>Here is a list of tags you can use that are associated with Quashing in your region</p>
    <div>
      <span class="vcopytag" v-on:click="copyToClipboard('#uxpx'+engineerRegionLC+'-global')" >#uxpx{{ engineerRegionLC }}-global</span>
      <span class="vcopytag" v-on:click="copyToClipboard('#uxpx'+engineerRegionLC+'-return')" >#uxpx{{ engineerRegionLC }}-return</span>
      <span class="vcopytag" v-on:click="copyToClipboard('#uxpxquashed')" >#uxpxquashed</span>
    </div>
  </div>
  <hr>
  <div class="vmenu vmenu--relative">
    <div v-for="(item, key) in menu.items" class="vmenuItem" :class="{ selected: menu.currentSelection==key}" v-html="item.icon" v-on:click="menu.currentSelection=key" :title="key"></div>
  </div>
</div>
    `
}
