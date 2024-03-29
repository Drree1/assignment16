const getTeams = async() => {
    try {
        return (await fetch("api/teams/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showTeams = async() => {
    let teams = await getTeams();
    let teamsDiv = document.getElementById("team-list");
    teamsDiv.innerHTML = "";
    teams.forEach((team) => {
        const section = document.createElement("section");
        section.classList.add("team");
        teamsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = team.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(team);
        };
    });
};

const displayDetails = (team) => {
    const teamDetails = document.getElementById("team-details");
    teamDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = team.name;
    teamDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    teamDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    teamDetails.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    teamDetails.append(p);
    

    const section = document.createElement("section");
    teamDetails.append(section);
    let ul2 = document.createElement("ul");
        section.append(ul2);
        ul2.append(getLi(`Owner: ${team.owner}`));
        ul2.append(getLi(`Super Bowl Appearances: ${team.appearances}`));
        ul2.append(getLi(`Super Bowl Wins: ${team.wins}`));
        ul2.append(getLi(`Founded: ${team.founded}`));
        ul2.append(getLi(`Team Legends: ${team.legends}`));
    


    /*const ul = document.createElement("ul");
    teamDetails.append(ul);
    console.log(team.legends);
    team.legends.forEach((legend) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = legend;
        
    });
    */

    eLink.onclick = (e) => {
        e.preventDefault();
        document.querySelector(".dialog").classList.remove("transparent");
        document.getElementById("add-edit-title").innerHTML = "Edit Team";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        deleteTeam(team);
    };

    populateEditForm(team);
};

const getLi = (data) => {
    const li = document.createElement("li");
    li.textContent = data;
    return li;
  };

const populateEditForm = (team) => {

    const form = document.getElementById("add-edit-team-form");
    form._id.value = team._id;
    form.name.value = team.name;
    form.description.value = team.owner;
    populateLegend(team)
};

const populateLegend = (team) => {
    const section = document.getElementById("player-boxes");

    team.legends.forEach((legend) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = legend;
        section.append(input);
    });
}


const deleteTeam = async(team) => {
    let response = await fetch(`/api/teams/${team._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showTeams();
    document.getElementById("team-details").innerHTML = "";
    resetForm();
}

const addEditTeam = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-team-form");
    const formData = new FormData(form);
    let response;
    //trying to add a new team
    if (form._id.value == -1) {
        formData.delete("_id");
        

        console.log(...formData);

        response = await fetch("/api/teams", {
            method: "POST",
            body: formData
        });
    }

    else {

        console.log(...formData);

        response = await fetch(`/api/teams/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    //successfully got data from server
    if (response.status != 200) {
        console.log("Error posting data");
    }

    team = await response.json();

    if (form._id.value != -1) {
        displayDetails(team);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showTeams();
};


const getLegend = () => {
    const inputs = document.querySelectorAll("#player-boxes input");
    let legend = [];

    inputs.forEach((input) => {
        legend.push(input.value);
    });

    return legend;
}

const resetForm = () => {
    const form = document.getElementById("add-edit-team-form");
    form.reset();
    form._id = "-1";
    document.getElementById("player-boxes").innerHTML = "";
};

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Team";
    resetForm();
};

const addPlayer = (e) => {
    e.preventDefault();
    const section = document.getElementById("player-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}

window.onload = () => {
    showTeams();
    document.getElementById("add-edit-team-form").onsubmit = addEditTeam;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparent");
    };

    document.getElementById("add-player").onclick = addPlayer;
};