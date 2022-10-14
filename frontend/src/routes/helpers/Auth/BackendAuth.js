export const BackendAuthProvider = {
  isAuthenticated: false,
  signin:(formData, callback, failureCallback) => {
    let responseStatus = undefined;
    const post = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password")
      })
    };

    fetch('http://localhost:8000/verificacion/token-auth/', post)
      .then(response => {
        responseStatus = response.status;
        return response.json();
      })
      .then(data => {
        if (responseStatus === 400) {
          failureCallback(data);
        } else if (responseStatus === 200){
          callback(data);
        }
      })
      .catch(error => {
        failureCallback(error)
      });
  },
  signout: async (callback) => {
    callback();
  }
};
