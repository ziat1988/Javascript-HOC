const inputTracker = (() => {
  // let form = null;
  let dataStorage = null;


  /**
   *
   * @param {function(HTMLFormElement, string):void} fn
   */
  function getForm(fn) {
    const form = document.querySelector('[data-form-type="auto_save"]');
    if (!form) {
      return;
    }

    const formName = form.getAttribute("name");
    fn(form, formName);
  }

  function trackInput() {
    console.log("track input called here");
    getForm(function (form, formName) {
      form.addEventListener("input", (e) => {
        console.log(e.target.value);
      });
    });
  }

  function trackTextArea() {
    getForm(function (form, formName) {});
  }

  function initListener() {
    document.getElementById("button-ajax").addEventListener("click", (e) => {
      console.log("clicked");
      setTimeout(() => {
        const formContainer = document.getElementById("form-container");

        // New form content after Ajax call
        // Update the form content
        formContainer.innerHTML = `
        <form data-form-type="auto_save" name="form_article">
        <div>
            <label for="title">Title</label>
            <input type="text" id="title">
        </div>
    
        
        <button type="button" id="button-ajax">Reload Form</button>
    </form>
        `;

        initListener();
        // Re-attach the input event listener
        trackInput();
      }, 1000);
    });
  }

  return {
    trackInput,
    trackTextArea,
    initListener,
  };
})();

inputTracker.initListener();
inputTracker.trackInput();
inputTracker.trackTextArea();

/*
const app = Vue.createApp({
  template: `
    <p>{{message}}</p>
   `,
  data() {
    return {
      message: "Hey I'm Dang",
    };
  },
}).mount("#app");
*/
