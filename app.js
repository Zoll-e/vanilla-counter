// Observer to track changes in state
class Observer {
  static observers = [];

  static subscribe(fn) {
    this.observers.push(fn);
  }

  static unsubscribe(fnToRemove) {
    this.observers = this.observers.filter((fn) => fn !== fnToRemove);
  }

  static notify(data) {
    this.observers.forEach((fn) => fn(data));
  }
}

// Handle changes in local storage
class Store {
  static initialize() {
    if (localStorage.getItem("count") === null) {
      localStorage.setItem("count", 0);
    }
  }

  static saveCount(count) {
    localStorage.setItem("count", count);
    Observer.notify(count);
  }

  static getCount() {
    return localStorage.getItem("count") ?? 0;
  }

  static resetCount() {
    this.saveCount(0);
  }
}

// Handle changes on UI
class UI {
  static displayCount() {
    const count = Store.getCount();
    document.querySelector("#count").textContent = count;
    UI.toggleResetButton(count);
  }

  static displayResetButton() {
    const existingResetButton = document.querySelector("#reset");
    if (existingResetButton) return;

    const button = document.createElement("a");
    button.id = "reset";
    button.className = "btn btn-info w-50 d-block";
    button.style.margin = "auto";
    button.appendChild(document.createTextNode("Reset"));

    const title = document.querySelector("#title");
    title.parentNode.insertBefore(button, title.nextSibling);

    document.querySelector("#reset").addEventListener("click", () => {
      Store.resetCount();
    });
  }

  static hideResetButton() {
    const resetButton = document.querySelector("#reset");
    if (resetButton) {
      resetButton.removeEventListener("click", Store.resetCount);
      resetButton.remove();
    }
  }

  static toggleResetButton(count) {
    if (parseInt(count) !== 0) {
      UI.displayResetButton();
    } else {
      UI.hideResetButton();
    }
  }
  static updateCount(count) {
    document.querySelector("#count").textContent = count;
    UI.toggleResetButton(count);
  }
}

// Handle changes in count
class Calculate {
  static add() {
    const currentCount = Store.getCount();
    Store.saveCount(parseInt(currentCount) + 1);
  }

  static subtract() {
    const currentCount = Store.getCount();
    Store.saveCount(parseInt(currentCount) - 1);
  }
}

// Subscribe UI to changes in the count
Observer.subscribe(UI.updateCount);

// Initialize app
function initializeApp() {
  Store.initialize();

  UI.displayCount();

  document.querySelector("#add").addEventListener("click", () => {
    Calculate.add();
  });

  document.querySelector("#subtract").addEventListener("click", () => {
    Calculate.subtract();
  });
}

document.addEventListener("DOMContentLoaded", () => initializeApp());
