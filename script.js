function handleFile() {
    const fileInput = document.getElementById('txtFile');
    const file = fileInput.value;

    console.log(file);

    if (file) {;
            const processedHours = processData(file);

            const resultContainer = document.getElementById('resultContainer');
            clearContainer(resultContainer);

            let totalMinutesCount = 0;
            let totalHoursCount;

            processedHours.forEach((day) => {
                const dayDiv = document.createElement('div');
                const startDiv = document.createElement('div');
                const endDiv = document.createElement('div');
                const pauseDiv = document.createElement('div');
                const totalHoursDiv = document.createElement('div');

                const {giorno, inizio, fine, pausa} = day;

                console.log(giorno)

                const total = hoursPerDay(inizio, fine, pausa);

                totalMinutesCount += total[0];

                totalHoursCount = countHours(totalMinutesCount);

                dayDiv.textContent = `${giorno}`;
                startDiv.textContent = `${inizio}`;
                endDiv.textContent = `${fine}`;
                pauseDiv.textContent = `${pausa} minuti`;
                totalHoursDiv.textContent = `${total[1][0]}:${(total[1][1] > 0) ? total[1][1] : '00'}`

                appendToContainer(resultContainer, dayDiv);
                appendToContainer(resultContainer, startDiv);
                appendToContainer(resultContainer, endDiv);
                appendToContainer(resultContainer, pauseDiv);
                appendToContainer(resultContainer, totalHoursDiv);
            });

            const totalHoursContainer = document.getElementById('totalHoursContainer');
            clearContainer(totalHoursContainer);

            const hoursDiv = document.createElement('div');

            hoursDiv.textContent = totalHoursCount;

            totalHoursContainer.appendChild(hoursDiv);
        } else {
            alert('Please choose a CSV file.');
        };
    }

function clearContainer(container) {
    while (container.firstChild) {
        const child = container.firstChild;
        if (child.classList && !child.classList.contains('help_title')) {
            container.removeChild(child);
        } else {
            break; // Stop clearing when encountering a title
        }
    }
}


function appendToContainer(container, element) {
    container.appendChild(element);
}

function processData(csvContent) {
    try {
        const csvData = csvContent.replaceAll(' ', '');

        const rows = csvData.split('\n');
        const headers = rows[0].split(',');

        const data = [];

        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');

            if (columns.length === headers.length) {
                const rowObject = {};
                for (let j = 0; j < headers.length; j++) {
                    rowObject[headers[j]] = columns[j];
                }
                data.push(rowObject);
            } else {
                console.warn('Skipping row:', rows[i]);
            }
        }

        return data;
    } catch (error) {
        console.error('Error processing CSV:', error);
        alert('Error processing CSV. Please check the console for details.');
    }
}


// Helpers

function countHours(total_minutes) {
    const hours = Math.floor(total_minutes / 60);

    const minutes = total_minutes % 60;

    return [hours, minutes];
}

function hoursPerDay (start, end, pause) {
    const [ startHour, startMinute ] = getTimeComponents(start);

    const [ endHour, endMinute ] = getTimeComponents(end);

    const pauseLength = countHours(pause);

    const totalHours = endHour - startHour - pauseLength[0];

    const minute = endMinute - startMinute

    const totalMinutes = totalHours * 60 + (endMinute - startMinute) - pauseLength[1];
    return [totalMinutes, countHours(totalMinutes)];
}

function getTimeComponents(time) {
    const [hour, minute] = time.split(':');
    return [parseInt(hour), parseInt(minute)];
}