const goalInput = document.getElementById("goal");
const criteriaInputs = document.querySelectorAll('#criteria_inputs > input');
const itemInputs = document.querySelectorAll('#items_inputs > input');
const pairwiseInputs = document.querySelectorAll('.pairwisetable input');

let updateCriteriaTable = function(input) {
  let classToUpdate = "." + input.target.id;
  let value = input.target.value;

  document.querySelectorAll(classToUpdate).forEach(function(heading) {
    heading.innerHTML = value;
  });

  let activeClass = 'active_' + input.target.id.replace('criteria', 'crit');

  if (value) {
    document.getElementById('pairwise_criteria').classList.add(activeClass);
    document.getElementById('pairwise_items').classList.add(activeClass);
  } else {
    document.getElementById('pairwise_criteria').classList.remove(activeClass);
    document.getElementById('pairwise_items').classList.remove(activeClass);
  }
  saveInputValue(input.target)
}

let updateItemTables = function(input) {
  let querySelectorToUpdate = "th." + input.target.id;
  let value = input.target.value;

  document.querySelectorAll(querySelectorToUpdate).forEach(function(heading) {
    heading.innerHTML = value;
  });

  let activeClass = 'active_' + input.target.id;

  if (value) {
    document.getElementById('pairwise_items').classList.add(activeClass);
  } else {
    document.getElementById('pairwise_items').classList.remove(activeClass);
  }
  saveInputValue(input.target)
}

let getRelatedInputId = function(activeInputId) {
  let type = activeInputId.substring(0, activeInputId.length-3);
  let indexes = activeInputId.slice(-3).split('v');
  return type + indexes[1] + 'v' + indexes[0];
}

let valueHasForwardSlash = function(value) {
  return value.indexOf('/') !== -1;
}

let clearPairwiseStyleClasses = function(input) {
  // remove all winner, loser & equal_weight classes
  document.querySelectorAll('.winner').forEach(function(node) {
    node.classList.remove('winner');
  });
  document.querySelectorAll('.loser').forEach(function(node) {
    node.classList.remove('loser');
  });
  document.querySelectorAll('.equal_weight').forEach(function(node) {
    node.classList.remove('equal_weight');
  });
  document.querySelectorAll('.related').forEach(function(node) {
    node.classList.remove('related');
  });
}

let getPairwiseInputRow = function(id) {
  // Item Form: c0_item2v0
  // Criteria Form: criteria2v0
  return parseInt(id.substr(-3, 1));
};

let getPairwiseInputColumn = function(id) {
  // Item Form: c0_item2v0
  // Criteria Form: criteria2v0
  return parseInt(id.substr(-1));
};

let getItemSectionId = function(id) {
  // Item Form: c0_item2v0
  // section ID: c0_items
  return id.substr(0,7) + 's';
};

let getItemSectionNumber = function(id) {
  // Item Form: c0_item2v0
  // section ID: c0_items
  return id.substr(1,1);
};


let inputIsCriteria = function(input) {
  return input.id.indexOf('criteria') === 0;
}

let styleRow = function(input, className) {
  let rowIndex = getPairwiseInputRow(input.id);
  if (inputIsCriteria(input)) {
    // input = #criteria0v1
    // row = tr.crit0 th.criteria0
    let row = document.querySelector('tr.crit' + rowIndex);
    row.classList.add(className);
  } else {
    // input = c0_item0v1
    // row = tr.item0
    let row = document.querySelector('tr.crit' + rowIndex);
    let section = getItemSectionId(input.id);
    document.querySelector('#' + section + ' tr.item' + rowIndex).classList.add(className);
  }
}

let styleColumn = function(input, className) {
  let columnIndex = getPairwiseInputColumn(input.id);
  if (inputIsCriteria(input)) {
    // input = #criteria0v1
    // column item = thead th.crit1 or td.crit
    let heading = document.querySelector('th.crit' + columnIndex);
    heading.classList.add(className);
    let columnTDs = document.querySelectorAll('td.crit' + columnIndex);
    columnTDs.forEach(function(td) {
      td.classList.add(className);
    })
  } else {
    // input = c0_item0v1
    // column heading = #c0_items thead th.item1
    // column item = #c0_items td.item1
    let section = getItemSectionId(input.id);
    let heading = document.querySelector('#' + section + ' thead th.item' + columnIndex);
    heading.classList.add(className);
    let columnTDs = document.querySelectorAll('#' + section + ' td.item' + columnIndex);
    columnTDs.forEach(function(td) {
      td.classList.add(className);
    })
  }
}

let styleRowAsWinner = function(input) {
  styleRow(input, 'winner');
}

let styleRowAsLoser = function(input) {
  styleRow(input, 'loser');
}

let styleRowAsEqualWeight = function(input) {
  styleRow(input, 'equal_weight');
}

let styleColumnAsWinner = function(input) {
  styleColumn(input, 'winner');
}

let styleColumnAsLoser = function(input) {
  styleColumn(input, 'loser');
}

let styleColumnAsEqualWeight = function(input) {
  styleColumn(input, 'equal_weight');
}

let clearDescriptiveSentence = function(input) {
  updateDescriptiveSentence(input, true);
}

let updateDescriptiveSentence = function(input, clear) {
  let row = getPairwiseInputRow(input.id);
  let col = getPairwiseInputColumn(input.id);

  if (inputIsCriteria(input)) {
    let A = document.getElementById('criteria'+row).value;
    let B = document.getElementById('criteria'+col).value;
    let sentence = document.getElementById('pairwise_criteria_sentence');
    sentence.innerHTML = clear ? '' : 'Rate '+A+'\'s importance over '+B+' <small>(1=equal, 3=moderate, 5=strong, 9=extreme)</small>'
  } else {
    let item = getItemSectionNumber(input.id);
    let A = document.getElementById('item'+row).value;
    let B = document.getElementById('item'+col).value;
    let I = document.getElementById('criteria'+item).value;
    let sentence = document.getElementById('criteria'+item+'_sentence');
    sentence.innerHTML = clear ? '' : 'For '+I+' rate '+A+'\'s importance over '+B+' <small>(1=equal, 3=moderate, 5=strong, 9=extreme)</small>'
  }
}

let handlePair = function(event) {
  let activeInput = event.target;
  if (event.type == 'blur') {
    clearPairwiseStyleClasses();
    clearDescriptiveSentence(activeInput);
  } else {
    setTimeout(function() {
      let relatedInput = document.getElementById(getRelatedInputId(activeInput.id));
      let activeValue = activeInput.value;
      //let relatedValue = relatedInput.value;

      clearPairwiseStyleClasses();

      if (activeValue) {
        if ( activeInput.readOnly ) {
          // NOP
        } else if (valueHasForwardSlash(activeValue)) {
          relatedInput.value = activeValue.split('/')[1];
          styleRowAsLoser(activeInput);
          styleColumnAsWinner(activeInput);
        } else if (activeValue === "1") {
          relatedInput.value = '1';
          styleRowAsEqualWeight(activeInput);
          styleColumnAsEqualWeight(activeInput);
        } else {
          relatedInput.value = '1/' + activeValue;
          styleRowAsWinner(activeInput);
          styleColumnAsLoser(activeInput);
        }

        if (relatedInput) {
          relatedInput.classList.add('related');
        }
      }
      else {
        // Allow users to delete cell values
        relatedInput.value = '';
        clearPairwiseStyleClasses();
      }

      // Save the data!
      saveInputValue(activeInput);
      saveInputValue(relatedInput);

      updateDescriptiveSentence(activeInput);
    });
  }
}

let saveInputValue = function(input) {
  if ( input.readOnly ) {
    return;
  }

  if ( input.value ) {
    localStorage.setItem( "ahp."+input.id, input.value );
  }
  else {
    localStorage.removeItem( "ahp."+input.id );
  }
}

let loadInputValue = function(input) {
  if ( input.readOnly ) {
    // No action
    return false;
  }

  let value = localStorage.getItem( "ahp."+input.id );

  if ( value ) {
    input.value = value;
  }

  return value ? true : false;
}

loadInputValue(goalInput);

goalInput.addEventListener('blur', function(event) {
  saveInputValue(event.target);
});

criteriaInputs.forEach(function(input) {
  input.addEventListener('blur', updateCriteriaTable);
  if ( loadInputValue(input) ) {
    updateCriteriaTable({'target':input, 'type':'blur'});
  }
});

itemInputs.forEach(function(input) {
  input.addEventListener('blur', updateItemTables);
  if ( loadInputValue(input) ) {
    updateItemTables({'target':input, 'type':'blur'});
  }
});

pairwiseInputs.forEach(function(input) {
  input.addEventListener('keyup', handlePair);
  input.addEventListener('blur', handlePair);
  input.addEventListener('focus', handlePair);
  if ( loadInputValue(input) ) {
    handlePair({'target':input, 'type':'blur'});
  }
});

let safeName = function(s) {
  return s.replace(/\W/g, '_');
}

/* Begin Data Management */

let resetForm = function(event) {
  if ( confirm("¿Desea reiniciar este formulario y PERDER todos sus datos?") ) {
    localStorage.clear();
    window.location = window.location.pathname;
  }
}
document.getElementById('datamgmt_reset').addEventListener('click', resetForm);
// Función para exportar los datos a un archivo JSON
let exportForm = function(event) {
  let fileName = prompt("Ingrese el nombre del archivo:", "ahp_data");
  if (!fileName) return; // Si el usuario cancela el prompt, no hacer nada

  document.getElementById("datamgmt").value = JSON.stringify(localStorage);
  let data = JSON.stringify(localStorage);
  let blob = new Blob([data], { type: 'application/json' });
  let url = URL.createObjectURL(blob);

  let a = document.createElement('a');
  a.href = url;
  a.download = fileName + '.json'; // Usar el nombre ingresado por el usuario
  document.body.appendChild(a);
  a.click();

  // Limpieza
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}
document.getElementById('datamgmt_export').addEventListener('click', exportForm);


let importForm = function(event) {
  /*try {
    let data = JSON.parse(document.getElementById("datamgmt").value);
    localStorage.clear(); // must follow parse function
    Object.keys(data).forEach(function (k) {
      localStorage.setItem(k, data[k]);
    });
    window.location = window.location.pathname;
  } catch (e) {
    alert("JSON string invalid: "+text.substring(1,32));
  }*/
    let fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';

  fileInput.addEventListener('change', function(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    reader.onload = function(e) {
      try {
        // Mostrar el contenido del archivo JSON en el área de texto
        let jsonData = e.target.result;
        let textarea = document.getElementById("datamgmt");
        textarea.value = jsonData;

        // Parsear los datos JSON y guardarlos en localStorage
        let data = JSON.parse(jsonData);
        localStorage.clear(); // Limpiar los datos actuales
        Object.keys(data).forEach(function (key) {
          localStorage.setItem(key, data[key]);
        });

        // Actualizar los parámetros y matrices de comparación
        updateUIWithImportedData(data);
      } catch (e) {
        alert("Error al leer el archivo JSON: " + e.message);
      }
    };

    reader.readAsText(file);
  });

  fileInput.click();
};

function updateUIWithImportedData(data) {
  // Aquí debes implementar la lógica para actualizar la interfaz de usuario
  // con los datos importados desde el archivo JSON.
  // Por ejemplo:
  goalInput.value = data['ahp.goal'];
  goalInput.dispatchEvent(new Event('blur'));

  criteriaInputs.forEach(function(input) {
    let value = data["ahp." + input.id];
    if (value) {
      input.value = value;
      input.dispatchEvent(new Event('blur'));
    }
  });

  itemInputs.forEach(function(input) {
    let value = data["ahp." + input.id];
    if (value) {
      input.value = value;
      input.dispatchEvent(new Event('blur'));
    }
  });

  pairwiseInputs.forEach(function(input) {
    let value = data["ahp." + input.id];
    if (value) {
      input.value = value;
      input.dispatchEvent(new Event('blur'));
    }
  });
  
}
document.getElementById('datamgmt_import').addEventListener('click', importForm);

// Provide data management textarea instructions that vanish when real content is pasted
const dataManagementHelpText = "Pegue aquí los datos exportados y haga clic en importar";
function dataManagementRemoveHelpText() {
  let ta = document.getElementById("datamgmt");
  if ( ta.value == dataManagementHelpText ) {
    ta.value = '';
  } else if ( ta.value.length == 0 ) {
    ta.value = dataManagementHelpText;
  }
}
document.getElementById('datamgmt').addEventListener('focus', dataManagementRemoveHelpText);
document.getElementById('datamgmt').addEventListener('blur', dataManagementRemoveHelpText);
dataManagementRemoveHelpText();

/* End Data Management */
let runAHP = function(event) {
  // Limpiar el contenedor de la tabla de rankings
  document.getElementById('rankings-table-container').innerHTML = '';

  // Limpiar gráficos previos
  document.getElementById('criteria').innerHTML = '';
  document.getElementById('rankings').innerHTML = '';
  document.getElementById('criteriaPieChart').innerHTML = '';

  let items = [];
  let criteria = [];
  let criteriaItemRank = {};
  let criteriaRank = [];

  itemInputs.forEach(function(input) {
      if(input.value) {
          items.push(input.value);
      }
  });

  criteriaInputs.forEach(function(input) {
      if(input.value) {
          criteria.push(safeName(input.value));
          criteriaItemRank[safeName(input.value)] = [];
      }
  });

  let itemTotalCheck = items.length;
  let criteriaTotalCheck = criteria.length;

  let getPairwiseItemInputCriteriaGroupIndex = function(id) {
      return parseInt(id.substr(1, 1));
  };

  let getCriteriaKeyNameFromId = function(id) {
      return criteria[getPairwiseItemInputCriteriaGroupIndex(id)];
  };

  let isRowVisible = function(input) {
      let total = inputIsCriteria(input) ? criteriaTotalCheck : itemTotalCheck;
      return getPairwiseInputRow(input.id) < total;
  }

  let isColumnVisible = function(input) {
      let total = inputIsCriteria(input) ? criteriaTotalCheck : itemTotalCheck;
      return getPairwiseInputColumn(input.id) < total;
  }

  let isCriteriaGroupVisible = function(input) {
      return getPairwiseItemInputCriteriaGroupIndex(input.id) < criteriaTotalCheck;
  }

  let isValueTruthy = function(input) {
      return !!input.value;
  }

  let pushToCriteriaItemRank = function(input) {
      const value = eval(input.value); 
      const id = input.id;
      const groupKey = getCriteriaKeyNameFromId(id);
      const rowIndex = getPairwiseInputRow(id);

      if(!criteriaItemRank[groupKey]) {
          criteriaItemRank[groupKey] = [];
      }
      if(!criteriaItemRank[groupKey][rowIndex]) {
          criteriaItemRank[groupKey][rowIndex] = []
      }

      criteriaItemRank[groupKey][rowIndex].push(value);
  }

  document.querySelectorAll('#pairwise_items input').forEach(function(input) {
      if(isCriteriaGroupVisible(input) && isRowVisible(input) && isColumnVisible(input) && isValueTruthy(input)) {
          pushToCriteriaItemRank(input);
      }
  });

  let tempCriteriaRow = [];

  document.querySelectorAll('#pairwise_criteria input').forEach(function(input) {
      if(isRowVisible(input)) {
          if(getPairwiseInputColumn(input.id) === 0 && getPairwiseInputRow(input.id) !== 0) {
              criteriaRank.push(tempCriteriaRow);
              tempCriteriaRow = [];
          }
          if(isValueTruthy(input) && isColumnVisible(input)) {
              tempCriteriaRow.push(eval(input.value));
          }
      }
  });
  criteriaRank.push(tempCriteriaRow);

  let applyTotalCriteriaClassName = function() {
      const criteriaContainer = document.getElementById('criteria');

      let getCriteriaClass = function(n) {
          return `total-criteria-${n}`;
      }

      for (let x = 1; x <= 8; x++) {
          criteriaContainer.classList.remove(getCriteriaClass(x));
      }

      criteriaContainer.classList.add(getCriteriaClass(criteriaTotalCheck));
  }

  applyTotalCriteriaClassName();

  let decision = window.runCalculation(items, criteria, criteriaItemRank, criteriaRank);

  // Ordenar los resultados de mayor a menor
  let sortedIndices = decision.rankings.series[0].map((value, index) => [value, index])
      .sort((a, b) => b[0] - a[0])
      .map(pair => pair[1]);

  decision.rankings.labels = sortedIndices.map(index => decision.rankings.labels[index]);
  decision.rankings.series = decision.rankings.series.map(serie => sortedIndices.map(index => serie[index]));

  //barras criterios
  new window.chartist.Bar('#criteria', {
      labels: decision.criteria.labels,
      series: decision.criteria.series
  }, {
      stackBars: true,
      horizontalBars: true,
      reverseData: true,
      axisY: {
          offset: 100
      }
  });

  //barras proveedores
  new window.chartist.Bar('#rankings', {
      labels: decision.rankings.labels,
      series: decision.rankings.series,
  }, {
      stackBars: true,
      horizontalBars: true,
      reverseData: true,
      axisY: {
          offset: 100
      }
  });

  // Crear la tabla de rankings
  function createRankingsTable(labels, series) {
      var container = document.getElementById('rankings-table-container');
      
      // Crear elementos de la tabla
      var table = document.createElement('table');
      var thead = document.createElement('thead');
      var tbody = document.createElement('tbody');
      
      // Crear fila de encabezado
      var headerRow = document.createElement('tr');
      var thProvider = document.createElement('th');
      thProvider.textContent = 'Proveedor';
      var thScore = document.createElement('th');
      thScore.textContent = 'Puntaje';
      headerRow.appendChild(thProvider);
      headerRow.appendChild(thScore);
      thead.appendChild(headerRow);
      
      // Crear filas de datos
      for (var i = 0; i < labels.length; i++) {
          var row = document.createElement('tr');
          var cellProvider = document.createElement('td');
          var providerName = document.getElementById(`item${i}`).value; 
          cellProvider.textContent = providerName;
          var cellScore = document.createElement('td');
          var totalScore = series.reduce((acc, curr) => acc + curr[i], 0); 
          cellScore.textContent = (totalScore * 100).toFixed(2) + '%'; 
          row.appendChild(cellProvider);
          row.appendChild(cellScore);
          tbody.appendChild(row);
      }
      
      // Ensamblar tabla
      table.appendChild(thead);
      table.appendChild(tbody);
      container.appendChild(table);
  }

  // Llamar a la función para crear la tabla
  createRankingsTable(decision.rankings.labels, decision.rankings.series);

  // Nuevo gráfico de pastel para mostrar la distribución de los pesos de los criterios
  new window.chartist.Pie('#criteriaPieChart', {
      labels: decision.criteria.labels,
      series: decision.criteria.series[0]
  });
  event.preventDefault();

  return false;
};

document.getElementById('calcbtn').addEventListener('click', runAHP);
document.getElementById('calcbtn').addEventListener('keypress', runAHP);

// Auto-loading prior state during page load triggers calls to handlePair()
// which uses setTimeout() to asynchronously configure the cells. The function
// clearPairwiseStyleClasses() needs to happen after all that activity
// to remove lingering dynamic styles intended for the user's visual focus.
setTimeout(clearPairwiseStyleClasses);


function isValidWeight(value) {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 1 && num < 10;
}