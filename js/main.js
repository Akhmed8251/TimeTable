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

    // weekTypeChoice.setChoices(
    //     [
    //         {
    //             value: 1,
    //             label: "Первая",
    //             selected: false,
    //             disabled: false
    //         },
    //         {
    //             value: 2,
    //             label: "Вторая",
    //             selected: false,
    //             disabled: false
    //         }
    //     ], "value", "label", true
    // )

    let subgroupSelect = document.querySelector("#subgroup")
    let subgroupChoice = new Choices(subgroupSelect, {
        ...choiceOptions,
        searchPlaceholderValue: "Введите подгруппу"
    });

    //subgroupChoice.setChoices(
    //    [
    //        {
    //            value: 1,
    //            label: "Для всей группы",
    //            selected: false,
    //            disabled: false
    //        },
    //        {
    //            value: 2,
    //            label: "Для первой подгруппы",
    //            selected: false,
    //            disabled: false
    //        },
    //        {
    //            value: 3,
    //            label: "Для второй подгруппы",
    //            selected: false,
    //            disabled: false
    //        }
    //    ], "value", "label", true
    //)

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

    const getFaculties = async (filialId) => {
        let response = await fetch(`/api/Content/GetCaseSFaculties?filId=${filialId}`)
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

    const getDepartments = async (filialId, facId) => {
        let response = await fetch(`/api/Content/GetDepartments?filId=${filialId}&facId=${facId}`)
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

    const getCourses = async (filialId, facId, deptName) => {
        let response = await fetch(`/api/Content/GetCourses?filId=${filialId}&facId=${facId}&deptName=${deptName}`)
        if (response.ok) {
            let data = await response.json()

            let courses = []
            for (let courseEl of data) {
                courses.push({
                    value: "" + courseEl,
                    label: "" + courseEl,
                    selected: false,
                    disabled: false
                })
            }

            courseChoice.setChoices(courses, "value", "label", true)
        }
    }

    const getTypeGroups = async (filialId, facId, department, course, eduFormId, eduDegreeId, weekTypeId) => {
        let response = await fetch(`/api/Content/GetTypeGroup?filId=${filialId}&facId=${facId}&department=${department}&course=${course}&edukindId=${eduFormId}&eduDegreeId=${eduDegreeId}&typeWeekId=${weekTypeId}`)
        if (response.ok) {
            let data = await response.json()

            if (data.length > 0) {
                subgroupSelect.closest(".filter-item").style.display = "block"

                let groups = []
                for (let group of data) {
                    groups.push({
                        value: group.id,
                        label: group.name,
                        selected: false,
                        disabled: false
                    })
                }

                subgroupChoice.setChoices(groups, "value", "label", true)
            } else {
                subgroupSelect.closest(".filter-item").style.display = "none"
            }
        }
    }

    const getTypeWeeks = async (filialId, facId, department, course, eduFormId, eduDegreeId) => {
        let response = await fetch(`/api/Content/GetTypeWeeks?filId=${filialId}&facId=${facId}&department=${department}&course=${course}&edukindId=${eduFormId}&eduDegreeId=${eduDegreeId}`)
        if (response.ok) {
            let data = await response.json()

            let weeks = []
            for (let week of data) {
                weeks.push({
                    value: week.id,
                    label: week.name,
                    selected: false,
                    disabled: false
                })
            }

            weekTypeSelect.setChoices(weeks, "value", "label", true)
        }
    }

    const clearChoices = (...choices) => {
        for (let choiceItem of choices) {
            choiceItem.clearStore()
        }
    }

    getFilials()

    filialSelect.addEventListener("choice", function (evt) {
        const filialId = evt.detail.choice.value
        if (filialId) {
            getFaculties(filialId)
            clearChoices(facChoice, courseChoice, deptChoice)
        }
    })

    facSelect.addEventListener("choice", function (evt) {
        const facId = evt.detail.choice.value
        const filialId = filialChoice.getValue(true)
        if (filialId) {
            getDepartments(filialId, facId)
            clearChoices(courseChoice, deptChoice)
        }

    })

    deptSelect.addEventListener("choice", function (evt) {
        const filialId = filialChoice.getValue(true)
        const facId = facChoice.getValue(true)
        const deptId = evt.detail.choice.value
        if (filialId && facId) {
            getCourses(filialId, facId, deptId)
            clearChoices(courseChoice)
        }
    })

    const eduKinds = document.querySelectorAll(".filter-item_edukind input[type='radio']")
    eduKinds.forEach(eduKindItem => {
        eduKindItem.addEventListener("click", function() {
            const filialId = filialChoice.getValue(true)
            const facId = facChoice.getValue(true)
            const department = deptChoice.getValue(true)
            const course = courseChoice.getValue(true)
            const eduFormId = eduKindItem.dataset.id
            const eduDegreeId = document.querySelector(".filter-item_degree input[type='radio']:checked").dataset.id

            if (filialId && facId && department && course && eduFormId && eduDegreeId) {
                getTypeWeeks(filialId, facId, department, course, eduFormId, eduDegreeId)
                clearChoices(weekTypeChoice)
            }
        })
    })

    const eduDegrees = document.querySelectorAll(".filter-item_degree input[type='radio']")
    eduDegrees.forEach(eduDegreeItem => {
        eduDegreeItem.addEventListener("click", function() {
            const filialId = filialChoice.getValue(true)
            const facId = facChoice.getValue(true)
            const department = deptChoice.getValue(true)
            const course = courseChoice.getValue(true)
            const eduFormId = document.querySelector(".filter-item_edukind input[type='radio']:checked").dataset.id
            const eduDegreeId = eduDegreeItem.dataset.id

            if (filialId && facId && department && course && eduFormId && eduDegreeId) {
                getTypeWeeks(filialId, facId, department, course, eduFormId, eduDegreeId)
                clearChoices(weekTypeChoice)
            }
        })
    })

    weekTypeSelect.addEventListener("choice", function (evt) {
        const filialId = filialChoice.getValue(true)
        const facId = facChoice.getValue(true)
        const department = deptChoice.getValue(true)
        const course = courseChoice.getValue(true)
        const eduFormId = document.querySelector(".filter-item_edukind input[type='radio']:checked").dataset.id
        const eduDegreeId = document.querySelector(".filter-item_degree input[type='radio']:checked").dataset.id
        const weekTypeId = evt.detail.choice.value

        if (filialId && facId && department && course && eduFormId && eduDegreeId) {
            getTypeGroups(filialId, facId, department, course, eduFormId, eduDegreeId, weekTypeId)
            clearChoices(subgroupChoice)
        }
    })  

    const getLesson = async (numberLesson) => {
        let response = await fetch(`/api/Content/GetLessons?numberLesson=${numberLesson}`)
        if (response.ok) {
            let lesson = await response.json()
            return lesson
        }
    }

    const getTimeTable = async (data) => {
        let response = await fetch(`/api/Content/GetTimeTables?filId=${data.filialId}&facId=${data.facultyId}&edukindId=${data.eduKindId}&eduDegreeId=${data.degreeId}&course=${data.courseName}${data.subgroupId ? `&typeGroupId=${data.subgroupId}` : ''}&typeWeekId=${data.weekType}&department=${data.deptName}`)
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
            let weekDays = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"]
            let res = ""

            for (let wday of weekDays) {
                let lessons = data.filter(x => x.weekDay == wday)
                if (lessons.length > 0) {
                    res += `
                        <li class="timetable__item item-timetable">
                            <h3 class="item-timetable__title">${wday}</h3>
                    `

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
                
                res += "</li>"
            }
            timeTableList.innerHTML = res
        } else {
            timeTableList.textContent = "Данные отсутствуют. Проверьте введённые данные"
        }
    }

    const timeTableFilterBtn = document.querySelector(".timetable-filter__btn")
    timeTableFilterBtn.addEventListener("click", () => {
        let isValid = false;

        const filialId = filialChoice.getValue(true)
        if (filialId) {
            isValid = true
        }

        const facultyId = facChoice.getValue(true)
        if (facultyId) {
            isValid = true
        }
        
        const courseName = courseChoice.getValue(true)
        if (courseName) {
            isValid = true
        }

        const deptName = deptChoice.getValue(true)
        if (deptName) {
            isValid = true
        }

        const weekType = weekTypeChoice.getValue(true)
        if (weekType) {
            isValid = true
        }

        const filterItemSubGroup = subgroupSelect.closest(".filter-item")
        const isVisible = getComputedStyle(filterItemSubGroup).display == "block"
        let subgroupId = null

        if (isVisible) {
            subgroupId = subgroupChoice.getValue(true)
            if (subgroupId) {
                isValid = true
            }
        }

        const eduKindChecked = document.querySelector(".filter-item_edukind input[type=radio]:checked")
        if (eduKindChecked) {
            isValid = true
        }

        const degreeChecked = document.querySelector(".filter-item_degree input[type=radio]:checked")
        if (degreeChecked) {
            isValid = true
        }

        if (isValid) {
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