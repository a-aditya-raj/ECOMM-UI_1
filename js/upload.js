let errorData = false;
let header = ["id", "name", "brand", "category", "size", "mrp", "quantity", "total"];
$(document).ready(async function () {
    await checkuser();
    if (!checkSession()) return;
    $('[data-toggle="tooltip"]').tooltip();

    $("button").on("click", async function() {
        await checkuser();
        if (!checkSession()) return;
        let fileHeader = [];
        Papa.parse(document.getElementById("upload-csv").files[0], {
            download: true,
            header: true,
            transformHeader: function (h) {
                fileHeader.push(h.trim().toLowerCase());
                return h.trim().toLowerCase();
            },
            skipEmptyLines: "greedy",
            complete: function (results) {
                validateheader(fileHeader, results.data);
            },
        });
    });

    $("#upload-csv").on("change", async function (list) {
        await checkuser();
        if (!checkSession()) return;
        //get the file name
        var fileName = list.target.files[0].name;
        //replace the "Choose a file" label
        $(this).next(".custom-file-label").html(fileName);
    });
});

function validateheader(fileHeader, data) {
    if (JSON.stringify(header) === JSON.stringify(fileHeader)) {
        $("#error").addClass('d-none');
        validateData(data);
    }
    else {
        $("#error").find("h5").text("Header Mismatch. Refer Sample File.");
        $("#error").removeClass('d-none');
        $("#table-container").addClass("d-none");
        return;
    }
}

async function validateData(data) {
    await checkuser();
    if (!checkSession()) return;
    if (!data.length) {
        showError("Empty File.");
        return;
    }
    //getting product from json
    $.getJSON("../assets/available-inventory.json", function (products) {
        for (let i = 0; i < data.length; i++) {
            let prod = findProduct(products, data[i].id);
            if (prod.length) {
                if (data[i]?.quantity == "") {
                    errorData = true;
                    data[i].errors = "Quantity is a required field.";
                } else {
                    if (data[i].quantity <= 0) {
                        errorData = true;
                        data[i].errors = "Quantity should be more than zero";
                    }
                    if (isNaN(data[i].quantity)) {
                        errorData = true;
                        data[i].errors = "Quantity should be a number more than zero";
                    }
                }
            } else {
                if (data[i].id == "") {
                    errorData = true;
                    data[i].errors = "Product ID is a required field";
                } else {
                    errorData = true;
                    data[i].errors = "Product with specified ID doesn't exist";
                }
            }
        }
        if (errorData == true) {
            $("#download-errors").removeClass("d-none");
            $("#table-container").addClass("d-none");
            $("#error").find("h5").text("There were errors in uploading CSV.");
            $("#error").removeClass("d-none");
            $("#download-errors").click(function () {
                downloadErrors(data);
            });
        } else {
            showSuccess("File Uploaded Successfully");
            showTable(data, products);
        }
    });
}

function findProduct(products, productId) {
    return products.filter((products) => productId == products.id);
}

async function downloadErrors(data) {
    await checkuser();
    if (!checkSession()) return;
    //unparsing to csv
    const csv = Papa.unparse(data, { columns: ["id", "quantity", "errors"] });
    // Creating a Blob for having a csv file format and passing the data with type
    const blob = new Blob([csv], { type: "text/csv" });
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);
    // Creating an anchor(a) tag of HTML
    const a = document.createElement("a");
    // Passing the blob downloading url
    a.setAttribute("href", url);
    //getting datetime of order
    var today = new Date().toLocaleString("en-IN");
    // Setting the anchor tag attribute for downloading and passing the download file name
    a.setAttribute("download", today + " errors.csv");
    // Performing a download with click
    a.click();
}

async function showTable(data, products) {
    await checkuser();
    if (!checkSession()) return;
    $(".table-row").remove();
    $("thead").empty();

    $('tbody').children("*").not("#upload-row").remove();

    let i = 0;
    getTableHead(data);
    data.map((data, index) => {
        getTableRows(data, findProduct(products, data.id));
        i++;
    });
    $("#table-container").removeClass("d-none");
}

async function getTableHead(data) {
    await checkuser();
    if (!checkSession()) return;
    $("thead").append(
        `<th>` + "Image" + `</th>` +
        `<th>` + "Name" + `</th>` +
        `<th>` + "Brand" + `</th>` +
        `<th>` + "MRP" + `</th>` +
        `<th>` + "Quantity" + `</th>` +
        `<th>` + "Total Price" + `</th>`
    );
}

async function getTableRows(data, product) {
    await checkuser();
    if (!checkSession()) return;

    let clone = $("#upload-row").clone();
    clone.removeClass("d-none");
    clone.removeAttr("id");
    clone.attr("id", product[0].id);
    clone.find("img").attr("src", product[0].imageUrl);
    clone.find("img").click(function () {
        window.location.href = "../html/detail.html?id=" + product[0].id;
    });
    clone.find("#quantity").text(data.quantity);
    clone.find("#brand").text(product[0].brand);
    clone.find("#mrp").text("Rs. " + product[0].mrp.toLocaleString());
    clone
        .find("#total-price")
        .text("Rs. " + (data.quantity * product[0].mrp).toLocaleString());
    clone.find("#name").text(product[0].name);
    $("tbody").append(clone);
}