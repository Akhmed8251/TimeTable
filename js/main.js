document.addEventListener("DOMContentLoaded", () => {
    var path = window.location.pathname; var host = window.location.hostname;
    document.getElementById("specialVersion").href = "https://finevision.ru/?hostname=" + host + "&path=" + path

    let choiceOptions = {
        noResultsText: "Результат не найден",
        itemSelectText: "",
        loadingText: "Загрузка данных...",
        noChoicesText: "Элементы списка отсутствуют",
        removeItemButton: true, 
        position: "bottom",
        searchResultLimit: 9999,
    }
    
    let facSelect = document.querySelector("#faculty")
    let facChoice = new Choices(facSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите название факультета"
    });

    let courseSelect = document.querySelector("#course")
    let courseChoice = new Choices(courseSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите название факультета"
    });

    let groupSelect = document.querySelector("#group")
    let groupChoice = new Choices(groupSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите название факультета"
    });

    let weekTypeSelect = document.querySelector("#week-type")
    let weekTypeChoice = new Choices(weekTypeSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите название факультета"
    });
    weekTypeChoice.setChoices(
        [
            {
                value: 1,
                label: "Первая",
                selected: false,
                disabled: false
            },
            {
                value: 2,
                label: "Вторая",
                selected: false,
                disabled: false
            }
        ], "value", "label", true
    )
    
    const getTasks = async () => {
        let response = await fetch("https://jsonplaceholder.typicode.com/todos")
        if (response.ok) {
            let data = await response.json()
            showTasks(data)
        }
    }
    
    const showTasks = (data) => {
        let tasks = []
        for (let task of data) {
            tasks.push({
                value: task.id,
                label: task.title,
                selected: false,
                disabled: false
            })
        }
        facChoice.setChoices(tasks, "value", "label", true);
        courseChoice.setChoices(tasks, "value", "label", true);
        groupChoice.setChoices(tasks, "value", "label", true);
    }
    
    getTasks()

    new Datepicker('#datepicker', {
        i18n: {
            months: [
                "Январь",
                "Февраль",
                "Март",
                "Апрель",
                "Май",
                "Июнь",
                "Июль",
                "Август",
                "Сентябрь",
                "Октябрь",
                "Ноябрь",
                "Декабрь",
            ],
            weekdays: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
        }
    });
})

