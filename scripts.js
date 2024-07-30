const arrayContainer = document.getElementById('array-container');
let array = [];
const SPEED = 1000; // Slow down the animation

function parseArray() {
    const input = document.getElementById('input-array').value;
    array = input.split(',').map(Number);
    renderArray();
}

function renderArray() {
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value * 3}px`; // Adjust height scaling if necessary
        bar.style.width = `${100 / array.length}%`;
        bar.textContent = value;
        arrayContainer.appendChild(bar);
    });
}

async function sortArray(algorithm) {
    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSort(0, array.length - 1);
            break;
        case 'quick':
            await quickSort(0, array.length - 1);
            break;
    }
    renderArray();
}

async function bubbleSort() {
    let n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            highlight(j, j + 1, 'compare');
            await sleep(SPEED);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                highlight(j, j + 1, 'swap');
                await sleep(SPEED);
            }
            renderArray();
        }
    }
}

async function selectionSort() {
    let n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            highlight(minIndex, j, 'compare');
            await sleep(SPEED);
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        highlight(i, minIndex, 'swap');
        renderArray();
        await sleep(SPEED);
    }
}

async function insertionSort() {
    let n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            highlight(j, j + 1, 'compare');
            await sleep(SPEED);
            array[j + 1] = array[j];
            highlight(j, j + 1, 'swap');
            await sleep(SPEED);
            j--;
            renderArray();
        }
        array[j + 1] = key;
        renderArray();
        await sleep(SPEED);
    }
}

async function mergeSort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    await mergeSort(left, mid);
    await mergeSort(mid + 1, right);
    await merge(left, mid, right);
}

async function merge(left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    const leftArray = new Array(n1);
    const rightArray = new Array(n2);

    for (let i = 0; i < n1; i++) leftArray[i] = array[left + i];
    for (let j = 0; j < n2; j++) rightArray[j] = array[mid + 1 + j];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        highlight(k, k, 'compare');
        await sleep(SPEED);
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        highlight(k, k, 'swap');
        renderArray();
        await sleep(SPEED);
        k++;
    }

    while (i < n1) {
        highlight(k, k, 'compare');
        await sleep(SPEED);
        array[k] = leftArray[i];
        highlight(k, k, 'swap');
        renderArray();
        await sleep(SPEED);
        i++;
        k++;
    }

    while (j < n2) {
        highlight(k, k, 'compare');
        await sleep(SPEED);
        array[k] = rightArray[j];
        highlight(k, k, 'swap');
        renderArray();
        await sleep(SPEED);
        j++;
        k++;
    }
}

async function quickSort(left, right) {
    if (left < right) {
        const pi = await partition(left, right);
        await quickSort(left, pi - 1);
        await quickSort(pi + 1, right);
    }
}

async function partition(left, right) {
    const pivot = array[right];
    let i = left - 1;
    for (let j = left; j < right; j++) {
        highlight(j, right, 'compare');
        await sleep(SPEED);
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            highlight(i, j, 'swap');
            renderArray();
            await sleep(SPEED);
        }
    }
    [array[i + 1], array[right]] = [array[right], array[i + 1]];
    highlight(i + 1, right, 'swap');
    renderArray();
    await sleep(SPEED);
    return i + 1;
}

function highlight(index1, index2, action) {
    const bars = document.querySelectorAll('.array-bar');
    if (action === 'compare') {
        bars[index1].classList.add('compared');
        bars[index2].classList.add('compared');
    } else if (action === 'swap') {
        bars[index1].classList.add('swapped');
        bars[index2].classList.add('swapped');
    }
    setTimeout(() => {
        bars[index1].classList.remove('compared', 'swapped');
        bars[index2].classList.remove('compared', 'swapped');
    }, SPEED - 100);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
