class CustomElement extends HTMLElement {
  constructor() {
    super();

    // Create a shadow DOM and get its root
    const shadowRoot = this.attachShadow({ mode: "open" });

    // Create a new element inside the shadow DOM
    const shadowContent = document.createElement("p");
    shadowContent.textContent = "This is inside the shadow DOM";

    // Append the new element to the shadow DOM
    shadowRoot.appendChild(shadowContent);
  }
}

// Define the custom element tag
customElements.define("custom-element", CustomElement);
