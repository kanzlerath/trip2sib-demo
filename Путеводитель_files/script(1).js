// script.js - обновленная версия
class BitrixDataFilter {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('Container not found:', containerSelector);
            return;
        }
        
        this.items = this.container.querySelectorAll('.link__list-el');
        this.filters = {};
        this.allFilterData = this.collectAllFilterData();
        this.pendingFilters = {}; // Для временного хранения выбранных значений
        this.initDropdowns();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Обработчики для потери фокуса с dropdown
        document.addEventListener('focusout', (e) => {
            // Ждем немного чтобы проверить, куда перешел фокус
            setTimeout(() => {
                const activeElement = document.activeElement;
                if (!activeElement.closest('.dropdown-filter')) {
                    this.applyPendingFilters();
                }
            }, 10);
        });
        
        // Обработчики для простых чекбоксов (применяем сразу)
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('filter-checkbox') && 
                !e.target.closest('.dropdown-filter')) {
                this.apply();
            }
        });
    }
    
    // Сохраняем выбранные значения во временный буфер и проверяем снятие всех чекбоксов
    savePendingFilters(filterType, changedCheckbox) {
        const dropdown = document.getElementById(`dropdown-${filterType}`);
        if (!dropdown) return;
        
        const allCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        const checkedCheckboxes = dropdown.querySelectorAll('input[type="checkbox"]:checked');
        const visibleCheckboxes = Array.from(allCheckboxes).filter(cb => 
            cb.parentElement.style.display !== 'none'
        );
        const visibleCheckedCheckboxes = Array.from(checkedCheckboxes).filter(cb => 
            cb.parentElement.style.display !== 'none'
        );
        
        // Если снят последний чекбокс - применяем фильтры сразу
        const wasLastCheckboxDeselected = changedCheckbox && !changedCheckbox.checked && 
                                         visibleCheckedCheckboxes.length === 0;
        
        if (wasLastCheckboxDeselected) {
            // Применяем фильтры сразу при снятии последнего чекбокса
            this.applyPendingFilters();
        } else {
            // Иначе сохраняем во временный буфер
            const pendingFilters = {};
            
            ['okrug', 'udalennost', 'kukhnya'].forEach(type => {
                const checkedBoxes = document.querySelectorAll(`#dropdown-${type} input[name="${type}"]:checked`);
                if (checkedBoxes.length > 0) {
                    pendingFilters[type] = Array.from(checkedBoxes).map(cb => cb.value);
                }
            });
            
            this.pendingFilters = pendingFilters;
        }
    }
    
    // Применяем временные фильтры
    applyPendingFilters() {
        // Обновляем основные фильтры из временных
        this.filters = { ...this.filters, ...this.pendingFilters };
        this.pendingFilters = {};
        this.apply();
    }
    
    // Собираем все возможные значения фильтров из всех элементов
    collectAllFilterData() {
        const allData = {
            okrug: new Set(),
            udalennost: new Set(),
            kartaGostia: new Set(),
            obTransport: new Set(),
            kukhnya: new Set()
        };
        
        this.items.forEach(item => {
            // Округ
            const okrugData = this.parseDataAttribute(item.dataset.okrug);
            if (Array.isArray(okrugData)) {
                okrugData.forEach(val => allData.okrug.add(val));
            } else if (okrugData) {
                allData.okrug.add(okrugData);
            }
            
            // Удаленность
            const udalennostData = this.parseDataAttribute(item.dataset.udalennost);
            if (Array.isArray(udalennostData)) {
                udalennostData.forEach(val => allData.udalennost.add(val));
            } else if (udalennostData) {
                allData.udalennost.add(udalennostData);
            }
            
            // Карта гостя
            if (item.dataset.kartaGostia !== undefined) {
                allData.kartaGostia.add(item.dataset.kartaGostia);
            }
            
            // Общественный транспорт
            if (item.dataset.obTransport !== undefined) {
                allData.obTransport.add(item.dataset.obTransport);
            }
            
            // Кухня
            const kukhnyaData = this.parseDataAttribute(item.dataset.kukhnya);
            if (Array.isArray(kukhnyaData)) {
                kukhnyaData.forEach(val => allData.kukhnya.add(val));
            } else if (kukhnyaData) {
                allData.kukhnya.add(kukhnyaData);
            }
        });
        
        // Преобразуем Set в массивы
        const result = {};
        Object.keys(allData).forEach(key => {
            result[key] = Array.from(allData[key]).sort();
        });
        
        return result;
    }
    
    // Собираем доступные значения из видимых элементов
    getAvailableFilterData() {
        const availableData = {
            okrug: new Set(),
            udalennost: new Set(),
            kartaGostia: new Set(),
            obTransport: new Set(),
            kukhnya: new Set()
        };
        
        const visibleItems = Array.from(this.items).filter(item => 
            item.style.display !== 'none'
        );
        
        // Собираем данные ТОЛЬКО из видимых элементов
        visibleItems.forEach(item => {
            // Округ
            const okrugData = this.parseDataAttribute(item.dataset.okrug);
            if (Array.isArray(okrugData)) {
                okrugData.forEach(val => availableData.okrug.add(val));
            } else if (okrugData) {
                availableData.okrug.add(okrugData);
            }
            
            // Удаленность
            const udalennostData = this.parseDataAttribute(item.dataset.udalennost);
            if (Array.isArray(udalennostData)) {
                udalennostData.forEach(val => availableData.udalennost.add(val));
            } else if (udalennostData) {
                availableData.udalennost.add(udalennostData);
            }
            
            // Карта гостя
            if (item.dataset.kartaGostia !== undefined) {
                availableData.kartaGostia.add(item.dataset.kartaGostia);
            }
            
            // Общественный транспорт
            if (item.dataset.obTransport !== undefined) {
                availableData.obTransport.add(item.dataset.obTransport);
            }
            
            // Кухня
            const kukhnyaData = this.parseDataAttribute(item.dataset.kukhnya);
            if (Array.isArray(kukhnyaData)) {
                kukhnyaData.forEach(val => availableData.kukhnya.add(val));
            } else if (kukhnyaData) {
                availableData.kukhnya.add(kukhnyaData);
            }
        });
        
        // Преобразуем Set в массивы
        const result = {};
        Object.keys(availableData).forEach(key => {
            result[key] = Array.from(availableData[key]).sort();
        });
        
        return result;
    }
    
    // Обновляем опции фильтров на основе доступных данных
    updateFilterOptions() {
        const availableData = this.getAvailableFilterData();
        
        // Обновляем ВСЕ фильтры на основе доступных данных
        this.updateDropdownOptions('okrug', availableData.okrug);
        this.updateDropdownOptions('udalennost', availableData.udalennost);
        this.updateDropdownOptions('kukhnya', availableData.kukhnya);
        
        // Обновляем простые чекбоксы
        this.updateSimpleCheckbox('kartaGostia', availableData.kartaGostia);
        this.updateSimpleCheckbox('obTransport', availableData.obTransport);
        
        // Всегда обновляем лейблы
        this.updateDropdownLabel('okrug');
        this.updateDropdownLabel('udalennost');
        this.updateDropdownLabel('kukhnya');
    }
    
    // Обновляем опции выпадающего списка
    updateDropdownOptions(filterType, availableValues) {
        const dropdown = document.getElementById(`dropdown-${filterType}`);
        if (!dropdown) return;
        
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const value = checkbox.value;
            const isAvailable = availableValues.includes(value);
            const isCurrentlyChecked = checkbox.checked;
            
            // Скрываем недоступные опции, которые не выбраны
            if (!isAvailable && !isCurrentlyChecked) {
                checkbox.parentElement.style.display = 'none';
            } else {
                checkbox.parentElement.style.display = 'flex';
            }
            
            // Если значение стало недоступно, но было выбрано - снимаем выбор
            if (!isAvailable && isCurrentlyChecked) {
                checkbox.checked = false;
                this.filtersNeedUpdate = true;
            }
        });
        
        // Обновляем текст кнопки
        this.updateDropdownLabel(filterType);
        
        // Скрываем/показываем всю группу фильтров если нет доступных опций
        this.updateFilterGroupVisibility(filterType);
    }
    
    // Обновляем видимость группы фильтров
    updateFilterGroupVisibility(filterType) {
        const dropdown = document.getElementById(`dropdown-${filterType}`);
        if (!dropdown) return;
        
        const filterGroup = dropdown.closest('.filter-group');
        const availableCheckboxes = Array.from(dropdown.querySelectorAll('input[type="checkbox"]')).filter(cb => 
            cb.parentElement.style.display !== 'none'
        );
        
        const checkedCheckboxes = Array.from(availableCheckboxes).filter(cb => cb.checked);
        
        // Скрываем группу если нет доступных опций И нет выбранных чекбоксов
        if (availableCheckboxes.length === 0 && checkedCheckboxes.length === 0) {
            filterGroup.style.display = 'none';
        } else {
            filterGroup.style.display = 'block';
        }
    }
    
    // Обновляем простые чекбоксы
    updateSimpleCheckbox(filterType, availableValues) {
        const checkbox = document.querySelector(`input[name="${filterType}"]`);
        if (!checkbox) return;
        
        const label = checkbox.closest('.simple-checkbox-label');
        const filterGroup = label.closest('.filter-group');
        
        const isAvailable = availableValues.includes('1');
        
        // Скрываем если недоступно и не выбрано
        if (!isAvailable && !checkbox.checked) {
            filterGroup.style.display = 'none';
        } else {
            filterGroup.style.display = 'block';
        }
        
        // Если значение стало недоступно, но было выбрано - снимаем выбор
        if (!isAvailable && checkbox.checked) {
            checkbox.checked = false;
            this.filtersNeedUpdate = true;
        }
    }
    
    // Обновляем текст кнопки выпадающего списка
    updateDropdownLabel(filterType) {
        const dropdownToggle = document.querySelector(`[data-target="dropdown-${filterType}"]`);
        if (!dropdownToggle) return;
        
        const label = dropdownToggle.querySelector('.dropdown-label');
        const checkboxes = document.querySelectorAll(`#dropdown-${filterType} input[type="checkbox"]`);
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked && cb.parentElement.style.display !== 'none').length;
        
        const labels = {
            'okrug': 'Округ',
            'udalennost': 'Удаленность', 
            'kukhnya': 'Кухня'
        };
        
        if (checkedCount > 0) {
            label.textContent = `${labels[filterType]} (${checkedCount})`;
            dropdownToggle.classList.add('has-selection');
        } else {
            const originalText = label.getAttribute('data-original') || labels[filterType];
            label.textContent = originalText;
            dropdownToggle.classList.remove('has-selection');
        }
    }
    
    initDropdowns() {
        // Закрытие по клику вне dropdown
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown-filter')) {
                this.closeAllDropdowns();
                this.applyPendingFilters();
            }
        });
        
        // Обработчики для toggle кнопок
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const targetId = toggle.getAttribute('data-target');
                this.toggleDropdown(targetId);
            });
        });
        
        // Обработчики для чекбоксов внутри dropdown
        document.querySelectorAll('.dropdown-content input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const filterType = e.target.name;
                this.savePendingFilters(filterType, e.target);
                this.updateDropdownLabel(filterType);
            });
        });
        
        // Предотвращаем закрытие при клике внутри dropdown
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                this.applyPendingFilters();
            }
        });
    }
    
    toggleDropdown(targetId) {
        const dropdown = document.getElementById(targetId);
        const isOpen = dropdown.style.display === 'block';
        
        this.closeAllDropdowns();
        
        if (!isOpen) {
            dropdown.style.display = 'block';
            dropdown.parentElement.classList.add('active');
        } else {
            this.applyPendingFilters();
        }
    }
    
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
        document.querySelectorAll('.dropdown-filter').forEach(filter => {
            filter.classList.remove('active');
        });
    }
    
    parseDataAttribute(value) {
        if (!value) return '';
        try {
            const cleanValue = value.replace(/\\'/g, "'");
            return JSON.parse(cleanValue);
        } catch (e) {
            return value;
        }
    }
    
    getCurrentFilters() {
        const filters = {};
        
        // Выпадающие фильтры - объединяем основные и временные
        ['okrug', 'udalennost', 'kukhnya'].forEach(type => {
            const checkedBoxes = document.querySelectorAll(`#dropdown-${type} input[name="${type}"]:checked`);
            if (checkedBoxes.length > 0) {
                filters[type] = Array.from(checkedBoxes).map(cb => cb.value);
            }
        });
        
        // Простые чекбоксы
        ['kartaGostia', 'obTransport'].forEach(type => {
            const checkbox = document.querySelector(`input[name="${type}"]`);
            if (checkbox && checkbox.checked) {
                filters[type] = ['1'];
            }
        });
        
        return filters;
    }
    
    // Логика соответствия фильтрам
    matchesFilters(element) {
        const filters = this.filters;
        
        if (Object.keys(filters).length === 0) {
            return true;
        }
        
        for (const [filterType, selectedValues] of Object.entries(filters)) {
            const elementValue = element.dataset[filterType];
            
            // Для простых чекбоксов проверяем наличие значения '1'
            if (['kartaGostia', 'obTransport'].includes(filterType)) {
                if (elementValue !== '1') {
                    return false;
                }
                continue;
            }
            
            // Для выпадающих фильтров
            if (elementValue === undefined) return false;
            
            const parsedValue = this.parseDataAttribute(elementValue);
            
            // Логика ИЛИ для округа и удаленности
            if (filterType === 'okrug' || filterType === 'udalennost') {
                const hasMatch = selectedValues.some(selectedValue => {
                    if (Array.isArray(parsedValue)) {
                        return parsedValue.includes(selectedValue);
                    } else {
                        return parsedValue == selectedValue;
                    }
                });
                
                if (!hasMatch) return false;
            } 
            // Для кухни - обычная логика (И)
            else {
                const hasMatch = selectedValues.some(selectedValue => {
                    if (Array.isArray(parsedValue)) {
                        return parsedValue.includes(selectedValue);
                    } else {
                        return parsedValue == selectedValue;
                    }
                });
                
                if (!hasMatch) return false;
            }
        }
        
        return true;
    }
    
    apply() {
        this.filters = this.getCurrentFilters();
        let visibleCount = 0;
        
        // Первый проход - применяем фильтры
        this.items.forEach(item => {
            if (this.matchesFilters(item)) {
                item.style.display = '';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Второй проход - обновляем доступные опции ВСЕХ фильтров
        this.updateFilterOptions();
        
        // Если снялись какие-то фильтры из-за недоступности - пересчитываем
        if (this.filtersNeedUpdate) {
            this.filtersNeedUpdate = false;
            this.apply();
            return;
        }
        
        this.updateResultsCount(visibleCount);
    }
    
    updateResultsCount(visibleCount) {
        let counter = document.getElementById('results-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'results-counter';
            counter.className = 'results-counter';
            this.container.parentNode.insertBefore(counter, this.container);
        }
        counter.textContent = `Найдено: ${visibleCount} из ${this.items.length}`;
    }
    
    clear() {
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        this.filters = {};
        this.pendingFilters = {};
        this.items.forEach(item => item.style.display = '');
        this.restoreAllFilterOptions();
        this.updateResultsCount(this.items.length);
        this.closeAllDropdowns();
    }
    
    // Восстанавливаем все опции фильтров при сбросе
    restoreAllFilterOptions() {
        // Показываем все опции во всех dropdown
        document.querySelectorAll('.dropdown-checkbox-label').forEach(label => {
            label.style.display = 'flex';
        });
        
        // Показываем все группы фильтров
        document.querySelectorAll('.filter-group').forEach(group => {
            group.style.display = 'block';
        });
        
        // Показываем все простые чекбоксы
        document.querySelectorAll('.simple-checkbox-label').forEach(label => {
            label.closest('.filter-group').style.display = 'block';
        });
        
        // Обновляем лейблы
        ['okrug', 'udalennost', 'kukhnya'].forEach(type => {
            this.updateDropdownLabel(type);
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.dropdown-label').forEach(label => {
        label.setAttribute('data-original', label.textContent);
    });
    
    window.bitrixFilter = new BitrixDataFilter('.items-container');
});

function applyFilters() {
    if (window.bitrixFilter) {
        window.bitrixFilter.applyPendingFilters();
        window.bitrixFilter.closeAllDropdowns();
    }
}

function clearFilters() {
    if (window.bitrixFilter) window.bitrixFilter.clear();
}