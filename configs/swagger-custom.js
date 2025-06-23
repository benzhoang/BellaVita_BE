window.onload = function() {
  // Lấy domain hiện tại
  const currentDomain = window.location.origin;
  // Lấy instance Swagger UI
  if (window.ui) {
    // Ghi đè lại servers
    const spec = window.ui.getConfigs().spec;
    if (spec && spec.servers) {
      spec.servers = [{ url: currentDomain }];
      window.ui.specActions.updateJsonSpec(spec);
    }
  }
};
