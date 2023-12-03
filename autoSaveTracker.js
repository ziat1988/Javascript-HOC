import {debounce, isEmpty} from 'lodash';

const autoSaveTracker = (function () {

    let parsedData =  null;
    const delay = 1000;
    const expiryPrefixKey = 'autosave_expiration_';
    const expiryDuration = 1000 * 60 * 60 //1000 * 60 * 60  * 24; // 24 h


    /**
     *
     * @param formName
     * @return {Object}
     * @private
     */
    function _parseFromLocalStorage(formName)
    {
        if (!parsedData) {
            parsedData = JSON.parse(localStorage.getItem(formName)) || {};
        }
        console.log('output parsed data:', parsedData)
        return parsedData;
    }

    /**
     *
     * @param {string} formName
     * @param {string} inputName
     * @param {string} targetValue
     * @private
     */
    function _updateInputStorage(formName,inputName, targetValue)
    {
        const dataFormStorage = _parseFromLocalStorage(formName);
        parsedData = {...dataFormStorage,[inputName]: targetValue}
        localStorage.setItem(formName, JSON.stringify(parsedData));

        _updateExpirationTime(expiryPrefixKey + formName)
    }

    /**
     *
     * @param {string} key
     * @private
     */
    function _updateExpirationTime(key)
    {
        localStorage.setItem(key,JSON.stringify(new Date().getTime() + expiryDuration))
    }


    /**
     *
     * @param {function(HTMLFormElement, string):void} fn
     * @private
     */
    function _getForm(fn) {
        const form = document.querySelector('[data-form-type="auto_save"]');
        if (!form) {
            return;
        }

        const formName = form.getAttribute("name");
        fn(form, formName);
    }

    function trackInputField()
    {
        _getForm(function (form, formName) {
            form.addEventListener("input",debounce((e)=>{
                if (e.target.type === 'text') {
                    _updateInputStorage(formName, e.target.name, e.target.value)
                }

            },delay));

            form.addEventListener("change", function (e) {
                // change date | switch | tag
                let value = e.target.value;
                if (e.target?.type === "checkbox") {
                    value= e.target.checked ? '1': '0';
                }
                _updateInputStorage(formName, e.target.name, value);
            });

        })
    }

    /**
     *
     * @param {Event} e
     */
    function trackSelectorChange(e)
    {
        // layout select
        _getForm(function (form, formName) {
            _updateInputStorage(formName, e.target.name,e.target.value);
        })
    }


    /**
     *
     * @return {boolean}
     * @private
     */
    function _isExpiry()
    {

        const form = document.querySelector('[data-form-type="auto_save"]');

        const formName = form.getAttribute('name')

        const keyTTL = expiryPrefixKey + formName

        if (!localStorage.getItem(keyTTL)) {
            return true; // considère not valid ???
        }

        const expiry = +localStorage.getItem(keyTTL)

        const now = new Date()

        return now.getTime() > expiry;

    }

    /**
     *
     * @param {string} formName
     * @private
     */
    function _cleanStorage(formName)
    {
        const expiryKey = expiryPrefixKey + formName
        localStorage.removeItem(expiryKey);
        localStorage.removeItem(formName);
    }

    /**
     *
     * @param {function (Object,HTMLFormControlsCollection,string):any} fn
     * @private
     */
    function _getDataStorage(fn)
    {
        // /**@type HTMLFormElement */
        // const form = document.querySelector('[data-form-type="auto_save"]');
        // if (!form) {
        //     return;
        // }
        // const formName = form.getAttribute('name')

        _getForm((form, formName)=>{
            if (!localStorage.getItem(formName)) {
                return;
            }

            const formElements = form.elements;

            const dataFormStorage = _parseFromLocalStorage(formName);


            if (_isExpiry()) {
                _cleanStorage(formName);
                return;
            }

            fn(dataFormStorage, formElements, formName);
        })

    }


    /**
     *
     * @param {Array.<Object>} medias
     * @param {string} inputName
     * @return {*[]}
     */
    function populateMedia(medias, inputName) {

        // make sure funciton return array : empty or array of object

        let localMedias = [];

        _getDataStorage((dataFormStorage, formElements)=>{
            if (dataFormStorage[inputName] && dataFormStorage[inputName] !== "") {
                localMedias =  dataFormStorage[inputName]

                localMedias = localMedias.filter(localMedia=> {
                    for (const media of medias){
                        if(localMedia.id === media.id){
                            return false
                        }

                    }
                    return true
                })

            }
        })

        return localMedias;

    }

    function populateInputField()
    {
        _getDataStorage(function (dataFormStorage, formElements) {
            for (const element of formElements) {
                if (element.name && dataFormStorage[element.name]) {
                    //update input value
                    element.value = dataFormStorage[element.name];

                    //switch case
                    if (element.type ==='checkbox') {
                        element.checked = dataFormStorage[element.name] === '1';
                    }

                    // select drop down
                    if (element.tagName === 'SELECT') {
                        loopSelect:
                            for (const select of Select._selects) {
                                if (select.input === element ) {
                                    for (const option of element.options) {
                                        if (option.value === dataFormStorage[element.name]) {
                                            select.select(option.value);
                                            break loopSelect;
                                        }
                                    }
                                }
                            }
                    }

                    // select layout ajax
                    if (element.hasAttribute('data-ajax-trigger-event')) {
                        $(SelectorHandler.defaults.selectableSelector).each((index,elem)=>{
                            if (index + 1   === +dataFormStorage[element.name]) {
                                $(elem).click();
                            }
                        })
                    }
                }
            }
        })
    }

    return {
        trackInputField,
        trackSelectorChange,
        populateInputField,
        populateMedia
    }

})()

export default autoSaveTracker;