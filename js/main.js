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

    let filialSelect = document.querySelector("#filial")
    let filialChoice = new Choices(filialSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите название филиала"
    });

    let courseSelect = document.querySelector("#course")
    let courseChoice = new Choices(courseSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите курс"
    });

    let deptSelect = document.querySelector("#department")
    let deptChoice = new Choices(deptSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите название направления (профиль)"
    });

    let weekTypeSelect = document.querySelector("#week-type")
    let weekTypeChoice = new Choices(weekTypeSelect, {
        ...choiceOptions,
        sorter: function (a, b) {
            return a.value - b.value;
        },
        searchPlaceholderValue: "Введите тип недели"
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

    let subgroupSelect = document.querySelector("#subgroup")
    let subgroupChoice = new Choices(subgroupSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите подгруппу"
    });

    subgroupChoice.setChoices(
        [
            {
                value: 1,
                label: "Для всей группы",
                selected: false,
                disabled: false
            },
            {
                value: 2,
                label: "Для первой подгруппы",
                selected: false,
                disabled: false
            },
            {
                value: 3,
                label: "Для второй подгруппы",
                selected: false,
                disabled: false
            }
        ], "value", "label", true
    )

    let timeTableList = document.querySelector(".timetable__list")

    const getFilials = async () => {
        let response = await fetch("/api/Content/GetCaseSFilials")
        if (response.ok) {
            let data = await response.json()

            let filials = []
            for (let filialEl of data) {
                filials.push({
                    value: filialEl.filId,
                    label: filialEl.filial,
                    selected: false,
                    disabled: false
                })
            }

            filialChoice.setChoices(filials, "value", "label", true)
        }
    }

    const getFaculties = async () => {
        let response = await fetch("/api/Content/GetCaseSFaculties")
        if (response.ok) {
            let data = await response.json()

            let faculties = []
            for (let fac of data) {
                faculties.push({
                    value: fac.facId,
                    label: fac.facName,
                    selected: false,
                    disabled: false
                })
            }

            facChoice.setChoices(faculties, "value", "label", true)
        }
    }

    const getDepartments = async () => {
        let response = await fetch("/api/Content/GetDepartments")
        if (response.ok) {
            let data = await response.json()

            let departments = []
            for (let deptEl of data) {
                departments.push({
                    value: deptEl,
                    label: deptEl,
                    selected: false,
                    disabled: false
                })
            }

            deptChoice.setChoices(departments, "value", "label", true)
        }
    }

    const getCourses = async () => {
        let response = await fetch("/api/Content/GetCourses")
        if (response.ok) {
            let data = await response.json()

            let courses = []
            for (let courseEl of data) {
                courses.push({
                    value: courseEl,
                    label: courseEl,
                    selected: false,
                    disabled: false
                })
            }

            courseChoice.setChoices(courses, "value", "label", true)
        }
    }

    getFilials()
    getFaculties()
    getDepartments()
    getCourses()

    const getLesson = async (numberLesson) => {
        let response = await fetch(`/api/Content/GetLessons?numberLesson=${numberLesson}`)
        if (response.ok) {
            let lesson = await response.json()
            return lesson
        }
    }

    const getTimeTable = async (data) => {
        let response = await fetch(`/api/Content/GetTimeTables?filId=${data.filialId}&facId=${data.facultyId}&edukindId=${data.eduKindId}&eduDegreeId=${data.degreeId}&course=${data.courseName}&typeGroupId=${data.subgroupId}&typeWeekId=${data.weekType}&department=${data.deptName}`)
        if (response.ok) {

            let data = await response.json()
            if (data) {
                for (let el of data) {
                    let lesson = await getLesson(el.numberLesson)
                    el.lessonTimeStart = lesson.start
                    el.lessonTimeEnd = lesson.end
                }
                showTimeTable(data)
            }
        } else {
            alert("Произошла ошибка. Попробуйте еще раз")
            timeTableList.textContent = ""
        }
    }

    const showTimeTable = (data) => {
        if (data.length > 0) {
            let weekDays = new Set(data.map(x => x.weekDay))
            let res = ""

            for (let wday of weekDays) {
                res += `
                    <li class="timetable__item item-timetable">
                        <h3 class="item-timetable__title">${wday}</h3>
                `

                let lessons = data.filter(x => x.weekDay == wday)

                for (let lessonEl of lessons) {
                    let startTime = new Date(lessonEl.lessonTimeStart).toLocaleTimeString().slice(0, 5)
                    let endTime = new Date(lessonEl.lessonTimeEnd).toLocaleTimeString().slice(0, 5)

                    res += `
                        <div class="item-timetable__wrapper">
                            <div class="item-timetable__time">
                                ${startTime}-${endTime}
                            </div>
                            <div class="item-timetable__info">
                                <h3 class="item-timetable__title">${lessonEl.subject}</h3>
                                <span class="item-timetable__teacher">${lessonEl.teacherName}</span>
                                <span class="item-timetable__classroom">Аудитория ${lessonEl.classRoom}</span>
                            </div>
                        </div>
                    `
                }      
            }
            timeTableList.innerHTML = res
        } else {
            timeTableList.textContent = "Данные отсутствуют. Проверьте введённые данные"
        }
    }

    const timeTableFilterBtn = document.querySelector(".timetable-filter__btn")
    timeTableFilterBtn.addEventListener("click", () => {   
        const facultyId = facChoice.getValue(true)
        const filialId = filialChoice.getValue(true)
        const courseName = courseChoice.getValue(true)
        const deptName = deptChoice.getValue(true)
        const weekType = weekTypeChoice.getValue(true)
        const subgroupId = subgroupChoice.getValue(true)
        const eduKindChecked = document.querySelector(".filter-item_edukind input[type=radio]:checked")
        const degreeChecked = document.querySelector(".filter-item_degree input[type=radio]:checked")

        if (facultyId && filialId && courseName && deptName && weekType && subgroupId && eduKindChecked && degreeChecked) {
            const data = {
                facultyId,
                filialId,
                courseName, 
                deptName,
                subgroupId,
                eduKindId: eduKindChecked.dataset.id,
                degreeId: degreeChecked.dataset.id,
                weekType
            }    

            timeTableList.textContent = "Загрузка..."
            getTimeTable(data)
        } else {
            alert("Не все данные заполнены!")
        }   
    })

    

    
})

