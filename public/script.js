const leadForm = document.getElementById("leadForm");
const leadsTable = document.getElementById("leadsTable");

async function loadLeads() {
    try {
        const response = await fetch("/api/leads");
        const leads = await response.json();

        leadsTable.innerHTML = "";

        let newCount = 0;
        let contactedCount = 0;
        let convertedCount = 0;

        leads.forEach(lead => {

            if (lead.status === "New") {
                newCount++;
            }

            if (lead.status === "Contacted") {
                contactedCount++;
            }

            if (lead.status === "Converted") {
                convertedCount++;
            }

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${lead.id}</td>
                <td>${lead.name}</td>
                <td>${lead.email}</td>
                <td>${lead.source}</td>
                <td class="status">${lead.status}</td>
                <td>${lead.notes || ""}</td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteLead(${lead.id})">
                        Delete
                    </button>
                </td>
            `;

            leadsTable.appendChild(row);
        });

        document.getElementById("totalLeads").textContent = leads.length;
        document.getElementById("newLeads").textContent = newCount;
        document.getElementById("contactedLeads").textContent = contactedCount;
        document.getElementById("convertedLeads").textContent = convertedCount;

    } catch (error) {
        console.error("Error loading leads:", error);
    }
}


leadForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const lead = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        source: document.getElementById("source").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value
    };

    try {

        const response = await fetch("/api/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(lead)
        });

        if (response.ok) {
            alert("Lead added successfully!");
            leadForm.reset();
            loadLeads();
        } else {
            alert("Failed to add lead.");
        }

    } catch (error) {
        console.error(error);
        alert("Something went wrong.");
    }
});


async function deleteLead(id) {

    if (!confirm("Are you sure you want to delete this lead?")) {
        return;
    }

    try {

        const response = await fetch(`/api/leads/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Lead deleted successfully!");
            loadLeads();
        } else {
            alert("Failed to delete lead.");
        }

    } catch (error) {
        console.error(error);
    }
}


loadLeads();