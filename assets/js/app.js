var cl = console.log;

const todoForm = document.getElementById("todoForm")
const todoControl = document.getElementById("todoControl")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const cancelBtn = document.getElementById("cancelBtn")
const addSubject = document.getElementById("addSubject")
const todoContainer = document.getElementById("todoContainer")
const spinner = document.getElementById("spinner")
const todoFormParent = document.getElementById("todoFormParent")

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`

const POST_URL = `${BASE_URL}/subjectTodos.json`

//========================================== Read =========================================
function fetchedTodos() {
    let xhr = new XMLHttpRequest();
    showSpinner("text-primary")
    xhr.open("GET", POST_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            for (const key in res) {
                let result = '';
                result = `
                <div class="col-3 mb-2" id=${key}>
                 <div class="card">
                    <div class="card-body p-2">
                        <div class="d-flex justify-content-between">
                            <h5><b> ${res[key].subject} </b></h5>
                            <div>
                                <i onclick="editSubject(this)" role="button" class="fa-solid fa-pen-to-square p-2 mr-1 text-primary"></i>
                                <i onclick="removeSubject(this)" role="button" class="fa-solid fa-trash p-2 text-danger"></i>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>`

                todoContainer.innerHTML += result
                hideSpinner("text-primary")
            }
        } else {
            hideSpinner("text-primary")
            cl("Something went wrong")
        }
    }
}
fetchedTodos()
//========================================== Create =========================================
function createNewSubject(eve) {
    eve.preventDefault()

    let newSubject = {
        subject: todoControl.value
    }

    let xhr = new XMLHttpRequest()
    showSpinner("text-primary")
    xhr.open("POST", POST_URL)
    xhr.send(JSON.stringify(newSubject))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            let col = document.createElement("div")
            col.className = "col-3 mb-2"
            col.id = res.className
            col.innerHTML = ` <div class="card">
                    <div class="card-body p-2">
                        <div class="d-flex justify-content-between">
                            <h5><b> ${newSubject.subject} </b></h5>
                            <div>
                                <i onclick="editSubject(this)" role="button" class="fa-solid fa-pen-to-square p-2 mr-1 text-primary"></i>
                                <i onclick="removeSubject(this)" role="button" class="fa-solid fa-trash p-2 text-danger"></i>
                            </div>
                        </div>
                    </div>
                </div>`
            todoContainer.prepend(col)

            todoForm.reset()
            hideSpinner("text-primary")
            todoFormParent.classList.add("d-none")

            snackBar("Added!", "Subject Todo Added Successfully!!!")
        } else {
            hideSpinner("text-primary")
            cl("something went wrong")
        }
    }

}
//========================================== Edit =========================================
function editSubject(ele) {
    let EDIT_ID = ele.closest(".col-3").id
    let EDIT_URL = `${BASE_URL}/subjectTodos/${EDIT_ID}.json`

    let xhr = new XMLHttpRequest();
    showSpinner("text-primary")
    xhr.open("GET", EDIT_URL)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            todoFormParent.classList.remove("d-none")
            let res = JSON.parse(xhr.response)
            localStorage.setItem("EDIT_ID", EDIT_ID)

            todoControl.value = res.subject

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
            hideSpinner("text-primary")
        }
        else {
            hideSpinner("text-primary")
            cl("Something went wrong")
        }
    }
}
//========================================== Update =========================================
function updateSubject(ele) {
    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    localStorage.removeItem("EDIT_ID")
    let UPDATE_URL = `${BASE_URL}/subjectTodos/${UPDATE_ID}.json`
    let updatedSubject = {
        subject: todoControl.value,
        id: UPDATE_ID
    }
    let xhr = new XMLHttpRequest();
    showSpinner("text-primary")
    xhr.open("PATCH", UPDATE_URL)
    xhr.send(JSON.stringify(updatedSubject))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)

            document.getElementById(UPDATE_ID).innerHTML = ` <div class="card">
                    <div class="card-body p-2">
                        <div class="d-flex justify-content-between">
                            <h5><b> ${updatedSubject.subject} </b></h5>
                            <div>
                                <i onclick="editSubject(this)" role="button" class="fa-solid fa-pen-to-square p-2 mr-1 text-primary"></i>
                                <i onclick="removeSubject(this)" role="button" class="fa-solid fa-trash p-2 text-danger"></i>
                            </div>
                        </div>
                    </div>
                  </div>`
            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")

            todoForm.reset()
            hideSpinner("text-primary")
            snackBar("Updated!", "Subject Todo Updated Successfully!!!")
            todoFormParent.classList.add("d-none")
        }
        else {
            hideSpinner("text-primary")
            cl("Something went wrong")
        }
    }
}
//========================================== Delete =========================================
function removeSubject(ele) {
    let DELETE_ID = ele.closest(".col-3").id
    let DELETE_URL = `${BASE_URL}/subjectTodos/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let xhr = new XMLHttpRequest();
            showSpinner("text-danger")
            xhr.open("DELETE", DELETE_URL)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response)
                    ele.closest(".col-3").remove()
                     hideSpinner("text-danger")
                    snackBar("Deleted!", "Subject Todo Deleted Successfully!!!")
                }
                else {
                    hideSpinner("text-danger")
                    cl("Something went wrong")
                }
            }
        }
    });


}
function showSpinner(color){
    spinner.classList.remove("d-none")
    spinner.classList.add(color)
}
function hideSpinner(color){
    spinner.classList.add("d-none")
    spinner.classList.remove(color)
}
function snackBar(title, msg) {
    Swal.fire({
        title: title,
        text: msg,
        icon: "success"
    });
}

addSubject.addEventListener("click", ()=>{
    todoFormParent.classList.remove("d-none")
})
cancelBtn.addEventListener("click", ()=>{
    todoFormParent.classList.add("d-none")
})

todoForm.addEventListener("submit", createNewSubject)
updateBtn.addEventListener("click", updateSubject)

























