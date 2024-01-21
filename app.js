const wrapper = document.querySelector(".wrapper"),
  form = document.querySelector("form"),
  imgEl = form.querySelector("img"),
  paraEl = form.querySelector(".text"),
  inputFile = form.querySelector('input[type="file"]'),
  areaEl = wrapper.querySelector("textarea"),
  closeBtn = wrapper.querySelector(".close"),
  copyBtn = wrapper.querySelector(".copy");

const fetchRequestData = async (formData, file) => {
  await fetch(`http://api.qrserver.com/v1/read-qr-code/`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      let data = result[0].symbol[0].data;
      paraEl.innerText = data
        ? "Qr Code To read Or scaning"
        : result[0].symbol[0].error;
      if (!data) return;
      imgEl.src = URL.createObjectURL(file);
      areaEl.innerText = data;
      wrapper.classList.add("active");
    })
    .catch(() => {
      paraEl.innerText = `could not find/read QR Code`;
    });
};

inputFile.addEventListener("change", (e) => {
  let file = e.target.files[0];
  let formData = new FormData();
  formData.append("file", file);
  paraEl.innerText = `Scanning Qr code...`;
  setTimeout(() => {
    fetchRequestData(formData, file);
  }, 1000);
});

form.addEventListener("click", () => inputFile.click());
closeBtn.addEventListener("click", () => wrapper.classList.remove("active"));
copyBtn.addEventListener("click", () => {
  copyBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;
  let copiedtext = areaEl.value;
  navigator.clipboard.writeText(copiedtext);
  setTimeout(() => (copyBtn.innerHTML = `Copy Text`), 1000);
});
