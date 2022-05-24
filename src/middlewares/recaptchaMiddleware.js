import axios from "axios";

class Recaptcha {
  constructor(secretKey, masterToken = null, scoreThreshold = 0.5) {
    this.secretKey = secretKey;
    this.masterToken = masterToken;
    this.scoreThreshold = scoreThreshold;
  }

  middleware = async (req, res, next) => {
    const captchaToken = req.headers["x-captcha-token"];

    if (
      this.masterToken &&
      captchaToken === this.masterToken
    ) {
      return next();
    } else if (!captchaToken) {
      return res.status(403).send({ message: "Missing token" });
    }

    const resp = await axios.get(
      `https://www.google.com/recaptcha/api/siteverify?secret=${this.secretKey}&response=${captchaToken}`
    );

    if (
      (resp.data.success && resp.data.score <= this.scoreThreshold) ||
      resp.data.success === false
    ) {
      let detail;
      if (resp.data.success === false) {
        detail = { detail: resp.data["error-codes"] };
      }
      return res
        .status(403)
        .send({ message: "Unable to verify humanity", ...detail });
    }

    return next();
  };
}

export default Recaptcha;
