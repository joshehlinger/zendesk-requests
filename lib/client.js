import fetch from 'unfetch';

export default class RequestsClient {

    /**
     * Creates a Requests client
     *
     * @param {string} subdomain of the zendesk account
     */
    constructor(subdomain) {
        this.url = `https://${subdomain}.zendesk.com/api/v2/requests.json`;
    }

    /**
     * Creates an anonymous Zendesk request.
     *
     * @param {string} name of the anonymous requester
     * @param {string} subject of the Zendesk request
     * @param {string} body of the Zendesk request
     * @return {Object} the zendesk requst that was created
     * @throws {BadRequest} an invalid name, subject, or body was used
     */
    async create({ name, subject, body }) {
        const response = await fetch(this.url, {
            body: JSON.stringify({
                request: {
                    requester: { name },
                    subject,
                    comment: { body },
                },
            }),
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
        });
        if (response.status >= 400) {
            const errorData = await response.text();
            throw new Error(errorData);
        }
        const data = await response.json();
        return data.request;
    }
}