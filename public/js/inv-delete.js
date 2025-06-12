const form = document.querySelector("#deleteForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      deleteBtn.removeAttribute("disabled")
    })