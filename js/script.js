const burgerIcon = document.querySelector(".burger-icon");
const headerMenu = document.querySelector(".header-menu");

burgerIcon.addEventListener("click", () => {
  headerMenu.classList.toggle("overlay");
  document.body.classList.toggle("menu-open");

  const isExpanded = burgerIcon.getAttribute("aria-expanded") === "true";
  burgerIcon.setAttribute("aria-expanded", !isExpanded);
});

document.querySelectorAll(".header-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    headerMenu.classList.remove("overlay");
    document.body.classList.remove("menu-open");
    burgerIcon.setAttribute("aria-expanded", "false");
  });
});

const skillList = [
  { language: "TypeScript", icon: "devicon-typescript-plain" },
  { language: "JavaScript", icon: "devicon-javascript-plain" },
  { language: "React", icon: "devicon-react-plain" },
  { language: "Next.JS", icon: "devicon-nextjs-plain" },
  { language: "Tailwind.css", icon: "devicon-tailwindcss-plain" },
  { language: "Material UI", icon: "devicon-materialui-plain" },
  { language: "JQuery", icon: "devicon-jquery-plain" },
  { language: "HTML", icon: "devicon-html5-plain" },
  { language: "CSS", icon: "devicon-css3-plain" },
  { language: "Git", icon: "devicon-git-plain" },
  { language: "Github", icon: "devicon-github-original" },
  { language: "VS Code", icon: "devicon-vscode-plain" },
];

const skills = () => {
  const skillContainer = document.querySelector(".skill-container");
  skillList.forEach((skill) => {
    const skillItem = document.createElement("div");
    skillItem.classList.add("skill-item");

    skillItem.innerHTML = `<i class="dev-icon ${skill.icon}"</i>
	 <p class="skill-name">${skill.language}</p>`;

    skillContainer.appendChild(skillItem);
  });
};
skills();

const callApi = async (param, type) => {
  try {
    const url = `https://api.github.com/${param}`;
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Fail to fetch data");
    }
    const repos = await response.json();
    repos
      .filter((repo) => !repo.private && !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .forEach((repo) => createCard(repo));
  } catch (error) {
    console.error("Error:", error);
  }
};

const fetchDataInParallel = async () => {
  const parameters = [
    {
      url: "users/mamahimiko/repos",
      type: "repo",
    },
  ];
  try {
    const promises = parameters.map((param) => callApi(param.url, param.type));
    await Promise.all(promises);
    animateCards();
  } catch (error) {
    console.error("Error during fetching:", error);
  }
};

const createCard = (repo) => {
  const workContainer = document.querySelector(".works-container");
  const card = document.createElement("div");
  const webpage = (repopage) => {
    if (repo.homepage === null) {
      return "";
    } else {
      return `<a href="${repopage.homepage}"><i class="fa-solid fa-earth-americas"></i></a>`;
    }
  };
  card.classList.add("work-card");
  console.log(repo);

  card.innerHTML = `
      <div 
      class="work-card__image-container" 
      style="background-image:url('img/${repo.name}.png')">
      </div>
      
      <div class="work-card__content">
        <h3 class="work-card__title">${repo.name}</h3>
        <p class="work-card__text">Main Skill: ${repo.language}</p>
		    <p>
		    	<a href="${repo.html_url}"><i class="fa-brands fa-github"></i>
          ${webpage(repo)}
          </a>
        </p>
      </div>
    `;

  workContainer.appendChild(card);
};

const tl = gsap.timeline({ repeat: 1 });

document.querySelectorAll(".word").forEach((word) => {
  tl.add(createChildTimeline(word), "-=90%");
});

function createChildTimeline(element) {
  const elText = element.querySelector(".rect");
  const tl = gsap
    .timeline()
    .from(element, {
      y: 16,
      opacity: 0,
      duration: 0.75,
      ease: "power4.out",
    })
    .set(elText, { opacity: 0 })
    .to(
      elText,
      {
        x: "105%",
        duration: 1,
        ease: "power4.out",
      },
      "-=50%"
    );
  return tl;
}

const animateCards = () => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo(
    ".work-card",
    {
      y: 100,
      autoAlpha: 0,
    },
    {
      y: 0,
      autoAlpha: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: ".work-card",
        toggleActions: "play none none reverse",
        start: "top center",
      },
    }
  );
};

fetchDataInParallel();
