document.addEventListener("DOMContentLoaded", function () {
    const calendar = document.getElementById("calendar");
    const monthYear = document.getElementById("monthYear");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");

    let currentDate = new Date();
    const minDate = new Date(2025, 3); // March 2025
    const maxDate = new Date(2027, 0); // February 2027

    function loadCalendar() {

        // Store the current scroll position
        const currentScrollPosition = window.scrollY;

        calendar.innerHTML = "";
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        // Capitalized month names
        const formattedMonth = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
            .format(currentDate)
            .replace(/^./, str => str.toUpperCase());

        monthYear.textContent = formattedMonth;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        fetch("/assets/data/availability.json")
            .then(response => response.json())
            .then(events => {
                let eventMap = {};

                // Fill in all dates between start and end for each event
                events.forEach(event => {
                    let startDate = new Date(event.start);
                    let endDate = new Date(event.end);
                    let eventId = event.start; // Unique event identifier
                    
                    while (startDate <= endDate) {
                        let dateKey = startDate.toISOString().split("T")[0];
                        eventMap[dateKey] = { ...event, eventId };
                        startDate.setDate(startDate.getDate() + 1);
                    }
                });

                // Generate empty slots for alignment
                for (let i = 0; i < startOffset; i++) {
                    let emptyDay = document.createElement("div");
                    emptyDay.classList.add("day", "empty");
                    calendar.appendChild(emptyDay);
                }

                // Generate the days
                for (let day = 1; day <= daysInMonth; day++) {
                    const dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                    const eventData = eventMap[dateKey] || { status: "available", event: "", eventId: "" };

                    let dayElement = document.createElement("div");
                    dayElement.classList.add("day", eventData.status);
                    dayElement.textContent = day;
                    dayElement.dataset.eventId = eventData.eventId;

                    if (eventData.event) {
                        dayElement.title = eventData.event; // Show event text on hover
                        
                        // Hover effect only for events in JSON
                        dayElement.addEventListener("mouseenter", function () {
                            document.querySelectorAll(`[data-event-id="${eventData.eventId}"]`).forEach(el => {
                                el.classList.add("hovered");
                            });
                        });

                        dayElement.addEventListener("mouseleave", function () {
                            document.querySelectorAll(`[data-event-id="${eventData.eventId}"]`).forEach(el => {
                                el.classList.remove("hovered");
                            });
                        });
                    } else {
                        dayElement.title = getStatusText(eventData.status);
                    }

                    calendar.appendChild(dayElement);
                }
            })
            .catch(error => console.error("Erreur de chargement des disponibilités", error));

        // // Hide navigation buttons at limits
        // prevMonthBtn.style.display = currentDate <= minDate ? "none" : "inline-block";
        // nextMonthBtn.style.display = currentDate >= maxDate ? "none" : "inline-block";
        
        // Restore the scroll position after the calendar update
        window.scrollTo(0, currentScrollPosition);
    }

    prevMonthBtn.addEventListener("click", function (event) {
        event.preventDefault();  // Prevent default button action (scrolling)
        if (currentDate > minDate) {
            currentDate.setMonth(currentDate.getMonth() - 1);
            loadCalendar();
        }
    });

    nextMonthBtn.addEventListener("click", function (event) {
        event.preventDefault();  // Prevent default button action (scrolling)
        if (currentDate < maxDate) {
            currentDate.setMonth(currentDate.getMonth() + 1);
            loadCalendar();
        }
    });

    function getStatusText(status) {
        switch (status) {
            case "available": return "Disponible ✅";
            case "partial": return "Quelqu'un visite, mais la chambre est libre 🟡";
            case "unavailable": return "Chambre occupée ❌";
            case "away": return "Nous ne sommes pas disponibles 🚫";
            default: return "Disponible ✅";
        }
    }

    loadCalendar();
});
