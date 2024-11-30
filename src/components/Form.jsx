import styles from './form.module.css';
import { useState } from 'preact/hooks';

const encode = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
}

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            return;
        }

        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode({ "form-name": "contact", ...formData })
        })
            .then(() => console.log("Success!"))
            .catch(error => console.log(error));

        setSubmitted(true);
    };

    return (
        <section className={styles.contactContainer}>
            {!submitted &&
                <form className={styles.contactForm}
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    data-netlify-honeypot="bot-field"
                    onSubmit={handleSubmit}
                    >
                    <input type="hidden" name="form-name" value="contact" />
                    <input type="hidden" name="bot-field" />
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="name">Name</label>
                    </div>

                    <div className={styles.inputContainer}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="subject">Subject</label>
                    </div>

                    <div className={styles.inputContainer}>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <label htmlFor="message">Message</label>
                    </div>

                    <button className={styles.submit} type="submit" aria-label="send your email and let's talk!">Let&#39;s Talk</button>
                </form>
            }
            {submitted && <p className="successMessage">Thank you for your message! I look forward to speaking with you! <a href="/" aria-label="go back to home page">Back to home page.</a></p>}
        </section>
    );
}