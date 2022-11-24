let cites = [];
let person = [];
let specializations = [];

Promise.all(
    [
        fetch("../data/cities.json"),
        fetch("../data/person.json"),
        fetch("../data/specializations.json"),
    ]
).then(async ([citesResponse, personResponse, specializationsResponse]) => {
    const citesJson = await citesResponse.json();
    const personJson = await personResponse.json();
    const specializationsJson = await specializationsResponse.json();
    return [citesJson, personJson, specializationsJson]
})
    .then(response => {
        cites = response[0];
        person = response[1];
        specializations = response[2];

        processData();
    })

function processData() {

    function getInfo() {
        let locationPerson = this.personal.locationId;
        let locationCite = cites.find(citeItem => {
            return locationPerson === citeItem.id;
        });

        if (locationPerson && locationCite) {
            return this.personal.firstName + " " + this.personal.lastName + ", " + locationCite.name;
        }
    }


    // Все дизайнеры владеющие figma
    let specializationsDesignersId = specializations.find(itemSpecializations => {
        return itemSpecializations.name === "designer";
    })

    let arrayDesigners = person.filter(itemPerson => {
        return itemPerson.personal.specializationId === specializationsDesignersId.id;
    })

    if (arrayDesigners) {
        arrayDesigners.forEach(item => {
            item.skills.find(function (itemSkill) {
                if (itemSkill.name.toLowerCase() === "figma") {
                    console.log("Дизайнер владеющий figma: " + getInfo.call(item));
                }
            })
        })
    } else {
        console.log("Дизайнеры не найдены!");
    }


    // Первый разработчик, который владеет react
    let developerReact = person.find(itemPerson => {
        let result = itemPerson.skills.some(itemSkill => {
            return itemSkill.name.toLowerCase() === "react";
        })

        if (result) {
            return itemPerson
        }
    })
    console.log("Первый разработчик, который владеет react: " + getInfo.call(developerReact));


    // Проверьте, все ли пользователи старше 18 лет
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();

    let age = person.every(itemPerson => {
        let birthday = itemPerson.personal.birthday;
        birthday = new Date(birthday.replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1')).getFullYear();
        return currentYear - birthday >= 18;
    })

    if (age) {
        console.log("Все пользователи старше 18 лет");
    } else {
        console.log("Не все пользователи старше 18 лет");
    }


    // Найдите всех backend-разработчиков из Москвы, которые ищут работу на полный день и отсортируйте их в порядке возрастания зарплатных ожиданий.
    // Все бэк разработчики
    let specializationsBackendId = specializations.find(itemSpecializations => {
        return itemSpecializations.name === "backend";
    })

    let citesBackendId = cites.find(itemCites => {
        return itemCites.name === "Москва";
    })

    let arrayBackendsDev = person.filter(itemPerson => {
        let employment = itemPerson.request.some(requestItem => {
            return requestItem.value === "Полная";
        })

        return itemPerson.personal.specializationId === specializationsBackendId.id &&
            itemPerson.personal.locationId === citesBackendId.id &&
            employment === true;
    })

    let arrayBackendsDevFilter = arrayBackendsDev.sort((a, b) => {
        return a.request[0].value - b.request[0].value;
    })

    console.log("Все backend-разработчики из Москвы, которые ищут работу на полный день, отсортированы в порядке возрастания зарплатных ожиданий!");
    console.log(arrayBackendsDevFilter);

    // Найдите всех дизайнеров, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов.
    let arrayDesignersLevelFilter = arrayDesigners.filter(item => {
        let figma = item.skills.find(itemFigma => {
            return itemFigma.name.toLowerCase() === "figma";
        })
        let photoshop = item.skills.find(itemFigma => {
            return itemFigma.name.toLowerCase() === "photoshop";
        })

        if (figma && photoshop) {
            return figma.level >= 6 && photoshop.level >= 6;
        }
    })
    console.log("Все дизайнеры, которые владеют Photoshop и Figma одновременно на уровне не ниже 6 баллов.");
    console.log(arrayDesignersLevelFilter);

    // Соберите команду для разработки проекта:
    // - дизайнера, который лучше всех владеет Figma
    // - frontend разработчика с самым высоким уровнем знания Angular
    // - лучшего backend разработчика на Go
    // Выведите результат в консоль, используя getInfo.

    console.log("Команда для разработки проекта:");
    function bestDesigner() {
        let maxLevel = 0;
        let maxLevelItem = null;
        arrayDesigners.forEach(itemDesigner => {
            let skillFigma = itemDesigner.skills.find(itemFigma => {
                return itemFigma.name.toLowerCase() === "figma";
            })
            if (skillFigma && skillFigma.level) {
                if (skillFigma.level > maxLevel) {
                    maxLevel = skillFigma.level
                    maxLevelItem = itemDesigner;
                }
            }
        })
        console.log("Дизайнер, который лучше всех владеет Figma: " + getInfo.call(maxLevelItem));
    }
    bestDesigner();

    let specializationsFrontendId = specializations.find(itemSpecializations => {
        return itemSpecializations.name.toLowerCase() === "frontend";
    })

    let arrayFrontends = person.filter(itemPerson => {
        return itemPerson.personal.specializationId === specializationsFrontendId.id;
    })

    function bestFrontend() {
        let maxLevel = 0;
        let maxLevelItem = null;
        arrayFrontends.forEach(itemFrontend => {
            let skillAngular = itemFrontend.skills.find(itemFigma => {
                return itemFigma.name.toLowerCase() === "angular";
            })
            if (skillAngular && skillAngular.level) {
                if (skillAngular.level > maxLevel) {
                    maxLevel = skillAngular.level
                    maxLevelItem = itemFrontend;
                }
            }
        })
        console.log("frontend разработчика с самым высоким уровнем знания Angular: " + getInfo.call(maxLevelItem));
    }

    bestFrontend();

    function bestBackEnd() {
        let maxLevel = 0;
        let maxLevelItem = null;
        arrayBackendsDev.forEach(itemBackend => {
            let skillGo = itemBackend.skills.find(itemFigma => {
                return itemFigma.name.toLowerCase() === "go";
            })
            if (skillGo && skillGo.level) {
                if (skillGo.level > maxLevel) {
                    maxLevel = skillGo.level
                    maxLevelItem = itemBackend;
                }
            }
        })
        console.log("Лучший backend разработчика на Go: " + getInfo.call(maxLevelItem));
    }

    bestBackEnd();
}