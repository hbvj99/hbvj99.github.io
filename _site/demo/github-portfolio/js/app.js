fetch("https://api.github.com/users/hbvj99").then(response => response.json())
.then(function (usr_data) {

    let usrDesc = 
    `
    <img class="responsive-image" alt="userImage" width="240" height="360" src=${usr_data['avatar_url']}>
    <h1>${usr_data.name}</h1></br>
    <p>He has ${usr_data.followers} followers in GitHub, and ${usr_data.public_repos} public repositories.</p>
    <p>Connect on <a href=${usr_data.html_url}>GitHub</a> Or, visit a <a href=${usr_data.blog}>blog</a></p>
    `;

    document.getElementById("authorBio").innerHTML = usrDesc;
})

fetch("https://api.github.com/users/hbvj99/repos?per_page=100&?sort=created&direction=desc").then(resp => resp.json()).then(function (data) {
    for (repo of data) {
        let link = document.createElement("a");
        link.href = repo.html_url;
        link.textContent = repo.name;
        let span = document.createElement("sup")
        span.textContent = repo.language
        let des = document.createElement("p")
        des.textContent = repo.description;
        des.id = 'repoDes';

        document.getElementById("userRepos").appendChild(link).append("\t");
        document.getElementById("userRepos").appendChild(span);
        document.getElementById("userRepos").appendChild(des);
    }
    document.getElementById("container").hidden = false;
    document.getElementById("load").hidden = true;
})
