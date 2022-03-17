var materias = {
    matematica: {
        nota: 0,
        valido: false,
        aprobado: false,
        input: document.getElementById("nota_matematica"),
    },
    lengua: {
        nota: 0,
        valido: false,
        aprobado: false,
        input: document.getElementById("nota_lengua"),
    },
    efsi: {
        nota: 0,
        valido: false,
        aprobado: false,
        input: document.getElementById("nota_efsi"),
    }
}

var NOTA_MIN = 1, NOTA_MAX = 10, NOTA_APROBADO = 6, nota_max = 0;

var btn = {
    promedio: document.getElementById("btn_promedio"),
    materia_max: document.getElementById("btn_materia_max"),
}

function validarCampo(nota){
    return nota >= NOTA_MIN && nota <= NOTA_MAX;
}   

function setFieldStatus(field, status){
    field.setAttribute("class", status ? "form-control is-valid" : "form-control is-invalid");
}

function corregirCampo(input){
    if(input.value.length > 3 || input.value > NOTA_MAX)
        input.value = input.value.slice(0, 2);

    if(input.value > NOTA_MAX || input.value < NOTA_MIN)
        input.value = input.value.slice(0, 1);
}

function handleInputChange (input, materia) {
    btn.promedio.setAttribute("disabled", "disabled");
    btn.materia_max.setAttribute("disabled", "disabled");
    corregirCampo(input)
    
    var nota = parseInt(input.value);
    materia.nota = nota;
    materia.valido = validarCampo(nota);
    setFieldStatus(input, materia.valido);

    btn.promedio.removeAttribute("disabled");
    btn.materia_max.removeAttribute("disabled");
}

// Recorro las materias y agrego un evento a cada input
Object.keys(materias).forEach(m => {
    materias[m].input.addEventListener("change", function(){
        handleInputChange(this, materias[m]);
    });

    materias[m].input.addEventListener("keyup", function(){
        handleInputChange(this, materias[m]);
    });
});

function comprobarCampos(materias){
    var err = "", camposValidos = true;

    for(var materia in materias){
        if(!materias[materia].valido){
            err = materia;    
            camposValidos = false;
            return { camposValidos, err };
        }
    }

    return { camposValidos, err };
}

function calcularPromedio(materias){
    var suma = 0;

    for(var materia in materias)
        suma += materias[materia].nota;

    return suma /= Object.keys(materias).length;
}

function obtenerNotaMasAlta(materias){
    var nota_max = 0;

    for(var materia in materias){
        if(materias[materia].nota > nota_max)
            nota_max = materias[materia].nota;
    }

    return nota_max;
}

function mostrarPromedio(promedio){
    document.getElementById("promedio").innerHTML = `
        <span> Promedio: 
            <b class="${promedio >= NOTA_APROBADO ? "text-success" : "text-danger"}">
                ${promedio.toFixed(1)} (${promedio >= NOTA_APROBADO ? "APROBADO" : "DESAPROBADO"})
            </b>
        </span>
    `;
}

function mostrarMateriasConNotaMasAlta(materias_max, nota){
    document.getElementById("materias_max_nota").innerHTML = `
        <p>Materia${materias_max.length > 1 ? "s" : ""} con nota mas alta:
            <b class="text-primary">
                ${materias_max.map(m => m.toUpperCase()).join(", ")} (${nota})
            </b>
        </p>
    `
}

form_promedios.addEventListener("submit", function(e) {
    e.preventDefault();

    // Comprobar que todas las materias sean validas
    var { camposValidos, err } = comprobarCampos(materias);

    if(camposValidos !== true) return alert("La nota de " + err + " no es valida");

    // Calcular promedio
    var promedio = calcularPromedio(materias);
    
    // Guardo la nota mas alta
    nota_max = obtenerNotaMasAlta(materias);

    mostrarPromedio(promedio);
});

document.getElementById("btn_materia_max").addEventListener("click", function(){
    var { camposValidos, err } = comprobarCampos(materias);

    if(camposValidos !== true) return alert("La nota de " + err + " no es valida");
    
    // Guardo las materias que tengan la nota mas alta
    nota_max = obtenerNotaMasAlta(materias);
    var materias_max = [];
    for(var materia in materias){
        if(materias[materia].nota == nota_max)
            materias_max.push(materia);
    }

    mostrarMateriasConNotaMasAlta(materias_max, nota_max)
})