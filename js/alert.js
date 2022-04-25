function showToaster(message, heading, type = 'danger' || 'success') {
  const toaster = `
      <div class="toast m-2 ml-auto  `+ type + `" role="alert" data-delay="1000">
          <div class="toast-header border-bottom">
              <strong class="mr-auto">`+ heading + `</strong>
              <button type="button" class="ml-2 close" data-dismiss="toast">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
          <div class="toast-body">
              `+ message + `
          </div>
      </div>`;

  $('.toast-container').append(toaster);

  if (type === 'danger') $('.toast.danger').attr('data-autohide', false);

  $('.toast').toast('show');
  $('.toast').on('hidden.bs.toast', function () {
    $(this).remove();
  });
}
function showSuccess(message = "Success message", heading = "Success",) {
  this.showToaster(message, heading, 'success');
}

function showError(message = "Error message", heading = "Error") {
  this.showToaster(message, heading, 'danger');
}