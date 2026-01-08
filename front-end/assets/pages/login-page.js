import { apiFetch } from "../js/api-client.js";

class LoginPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="assets/css/login.css">
      <div class="card" role="dialog" aria-labelledby="login-title">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <div style="width:18px"></div>
          <strong id="login-title">Бүртгүүлэх</strong>
          <div class="close">✕</div>
        </div>

        <div class="subtitle">
          Бид таны дугаарыг баталгаажуулахын тулд утсаар залгах эсвэл мессеж илгээх болно.
        </div>

        <form onsubmit="event.preventDefault(); alert('Continue clicked')">
          <div class="form-group">
            <label for="lastname">Овог</label>
            <input id="lastname" name="lastname" type="text" placeholder="Овог" required>
          </div>

          <div class="form-group">
            <label for="name">Нэр</label>
            <input id="name" name="name" type="text" placeholder="Нэр" required>
          </div>

          <div class="form-group">
            <label for="phone">Утасны дугаар</label>
            <div class="phone-wrap">
              <div class="country">
                <select name="country">
                  <option value="+976">Монгол (+976)</option>
                </select>
              </div>
              <input id="phone" class="phone" type="tel" name="phone" required placeholder="Phone number">
            </div>
          </div>

          <div class="form-group">
            <label for="studentId">Оюутны ID</label>
            <input id="studentId" name="studentId" type="text" placeholder="23b1num0245" required>
          </div>

          <button class="continue-btn" type="submit">Бүртгүүлэх</button>

          <div class="privacy">Нууцлалын бодлого</div>

          <div class="or">эсвэл</div>

          <div class="social">
            <button type="button" class="btn-social">
              <img src="assets/img/num-logo.svg" alt="num-logo">
              SISI-ээр үргэлжлүүлэх
            </button>
          </div>
        </form>
      </div>
    `;

    const form = this.querySelector("form");
    const closeBtn = this.querySelector(".close");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        location.hash = "#home";
      });
    }

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = this.querySelector("#name")?.value?.trim() || "Нэргүй";
        const lastName = this.querySelector("#lastname")?.value?.trim() || "";
        const phone = this.querySelector("#phone")?.value?.trim() || "";
        const idVal = this.querySelector("#studentId")?.value?.trim() || "";

        const fullName = [lastName, name].filter(Boolean).join(" ").trim() || "Зочин хэрэглэгч";

        try {
          const res = await apiFetch(`/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: fullName,
              phone,
              studentId: idVal,
            }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Нэвтрэх үед алдаа гарлаа");
          }

          const data = await res.json();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userId", data.user?.id || "");
          localStorage.setItem("userName", data.user?.name || fullName);
          localStorage.setItem("userPhone", data.user?.phone || phone);
          localStorage.setItem("userStudentId", data.user?.student_id || idVal);
          localStorage.setItem("userRegistered", "1");

          window.dispatchEvent(new Event("user-updated"));

          const hasDraft = localStorage.getItem("pendingOrderDraft");
          location.hash = hasDraft ? "#home" : "#profile";
        } catch (err) {
          alert(err.message || "Нэвтрэх үед алдаа гарлаа");
        }
      });
    }
  }
}

customElements.define('login-page', LoginPage);
