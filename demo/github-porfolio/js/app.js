fetch("https://api.github.com/users/hbvj99").then(response => response.json()).then(function (usr_data) {

    let usrDesc = `
    <img class="responsive-image" alt="userImage" width="240" height="360" src=${
        usr_data['avatar_url']
    }>
    <h1>${
        usr_data.name
    }</h1></br>
    <p>He has ${
        usr_data.followers
    } followers in GitHub, and ${
        usr_data.public_repos
    } public repositories.</p>
    <p>Connect on <a href=${
        usr_data.html_url
    }>GitHub</a> Or, visit a <a href=${
        usr_data.blog
    }>blog</a></p>
    `;

    document.getElementById("authorBio").innerHTML = usrDesc;
})

fetch("https://api.github.com/users/hbvj99/repos?per_page=100&?sort=created&direction=desc").then(resp => resp.json()).then(function (repos) {
    for (repo of repos) {
        let link = document.createElement("a");
        link.href = repo.html_url;
        link.textContent = repo.name;
        let span = document.createElement("sup")
        span.textContent = repo.language
        let des = document.createElement("p")
        des.textContent = repo.description;
        des.id = 'repoDes';

        // document.getElementById("userRepos").appendChild(link).append("\t");
        // document.getElementById("userRepos").appendChild(span);
        // document.getElementById("userRepos").appendChild(des);


        let current_page = 1;
        let records_per_page = 3;

        let objJson = [{
                adName: repo.name
            },];

        console.log(objJson);


        function prevPage() {
            if (current_page > 1) {
                current_page--;
                changePage(current_page);
            }
        }

        function nextPage() {
            if (current_page < numPages()) {
                current_page++;
                changePage(current_page);
            }
        }

        function changePage(page) {
            let btn_next = document.getElementById("btn_next");
            let btn_prev = document.getElementById("btn_prev");
            let listing_table = document.getElementById("listingTable");
            let page_span = document.getElementById("page");

            // Validate page
            if (page < 1) 
                page = 1;
            

            if (page > numPages()) 
                page = numPages();
            


            listing_table.innerHTML = "";

            for (let i =( page - 1) * records_per_page; i < (page * records_per_page) && i < objJson.length; i++) {
                listing_table.innerHTML += objJson[i].adName + "<br>";
            }
            page_span.innerHTML = page + "/" + numPages();

            if (page == 1) {
                btn_prev.style.visibility = "hidden";
            } else {
                btn_prev.style.visibility = "visible";
            }

            if (page == numPages()) {
                btn_next.style.visibility = "hidden";
            } else {
                btn_next.style.visibility = "visible";
            }
        }
        document.getElementById("container").hidden = false;
        document.getElementById("load").hidden = true;
    }

    function numPages() {
        return Math.ceil(objJson.length / records_per_page);
    }


    window.onload = function () {
        changePage(1);
    };


})
