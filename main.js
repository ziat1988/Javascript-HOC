import "/components/custom-element.js";

const inputTracker = (() => {
  let form = null;
  let dataStorage = null;

  function wrapperTrack(fn) {
    form = form ? form : getForm();
    if (!form) {
      return;
    }

    const formName = form.getAttribute("name");

    fn(formName);
  }

  function getForm() {
    console.log("function getForm suppose expensive call");
    return document.querySelector('[data-form-type="auto_save"]');
  }

  function trackInput() {
    wrapperTrack(function (formName) {
      console.log("this is from input :", formName);
    });
  }

  function trackTextArea() {
    wrapperTrack(function (form) {
      console.log("this is from text area");
    });
  }

  return {
    trackInput,
    trackTextArea,
  };
})();

inputTracker.trackInput();
inputTracker.trackTextArea();
