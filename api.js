// Author: Mehmet Kahya
// Created: 17 March 2024
// Last Updated: 28.08.2024

console.log(`
  ████████╗███████╗███╗   ███╗██████╗     ███╗   ███╗ █████╗ ██╗██╗     
  ╚══██╔══╝██╔════╝████╗ ████║██╔══██╗    ████╗ ████║██╔══██╗██║██║     
     ██║   █████╗  ██╔████╔██║██████╔╝    ██╔████╔██║███████║██║██║     
     ██║   ██╔══╝  ██║╚██╔╝██║██╔═══╝     ██║╚██╔╝██║██╔══██║██║██║     
     ██║   ███████╗██║ ╚═╝ ██║██║         ██║ ╚═╝ ██║██║  ██║██║███████╗
     ╚═╝   ╚══════╝╚═╝     ╚═╝╚═╝         ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝
  `);

console.log("API is ready!");

function warningAlert() {
  alert(
    "⚠️ This project is purely for educational purposes. We do not allow illegal things to be done with this project and we are not responsible for any incidents that may occur. This project uses 1secmail's API for creating e-mails. Use it legally ⚠️"
  );
}

function getUserAndDomain() {
  const addr = $("#addr").val();
  if (!addr) {
    return null;
  }

  const [user, domain] = addr.split("@");
  return { user, domain };
}

function genEmail() {
  $.getJSON(
    "https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1",
    (res) => {
      $("#addr").val(res[0]);
      refreshMail();
    }
  );
}

function refreshMail() {
  const { user, domain } = getUserAndDomain();

  if (!user || !domain) return;

  $.getJSON(
    `https://www.1secmail.com/api/v1/?action=getMessages&login=${user}&domain=${domain}`,
    (emails) => {
      const emailsElement = $("#emails");
      emailsElement.empty();

      emailsElement.append(`
          <tr>
            <th><b>From</b></th>
            <th><b>Subject</b></th>
            <th><b>Date</b></th>
            <th><b>View</b></th>
          </tr>
        `);

      for (const email of emails) {
        emailsElement.append(`
            <tr>
              <td>${email.from}</td>
              <td>${email.subject}</td>
              <td>${email.date}</td>
              <td id="${email.id}"><a onclick="loadEmail('${email.id}')" style="color: blue;"><i class="fas fa-eye"></i> View</a></td>
            </tr>
          `);

        // Check if domain matches and generate a new email address
        if (email.from.includes("dpptd.com")) {
          genEmail(); // Generate a new email address
        }
      }
    }
  );
}

function loadEmail(id) {
  const { user, domain } = getUserAndDomain();

  if (!user || !domain) return;

  // Redirect to content.html and send parameters user, domain, and id
  window.location.href = `content.html?id=${id}&user=${user}&domain=${domain}`;
}

// Initialize email generation on page load
$(document).ready(function() {
  genEmail(); // Automatically generate a new email address
});
