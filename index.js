
module.exports = {
    blocks: {
        qcircuit: {
            process: function(blk) {
                return "<script>" + blk.body + "</script>";
            }
        }
    },
    hooks: {
        "page:before": function(page) {
            results = page.content.match(/{% qcircuit %}((.*[\r\n]+)+?)?{% endqcircuit %}/igm);
            if(results == null) return;

            let len = results.length;
            circuit_names = [];
            for (var circuit_index = 0; circuit_index < len; circuit_index++) {
                circuit_name = "__qcircuit"+String(circuit_index)+"__";
                circuit_names.push(circuit_name)
                new_str = results[circuit_index].replace("{% qcircuit %}", "{% qcircuit %}\n"+"var "+circuit_name + " = ");
                new_str += "\n<div id=\""+ circuit_name +"\"></div>\n"
                page.content = page.content.replace(results[circuit_index], new_str);
            }
            
            //load_str = '<script src="https://unpkg.com/@microsoft/quantum-viz.js"></script>\n'
            load_str = '<script src="https://unpkg.com/@microsoft/quantum-viz.js@1.0.2/dist/qviz.min.js"></script>\n'            
            load_str += "<script>\n"
            load_str += "var circuit_list = {\n"
            for(let name of circuit_names){
                load_str += "    \""+name+"\": " + name + ",\n";
            }
            load_str += "}\n"
            /*
            load_str += 
            `if(document.readyState == 'loading'){
                window.addEventListener("load", function(){
                    for(let key in circuit_list){
                        var element = document.getElementById(key);
                        if (element == null) continue;
                        var circuit = circuit_list[key];
                        qviz.draw(circuit, element, qviz.STYLES['Default'])
                    }
                });
            }else{
                for(let key in circuit_list){
                    var element = document.getElementById(key);
                    if (element == null) continue;
                    var circuit = circuit_list[key];
                    qviz.draw(circuit, element, qviz.STYLES['Default'])
                }
            }\n`
            */
            load_str += 
            `
            for(let key in circuit_list){
                var element = document.getElementById(key);
                if (element == null) continue;
                var circuit = circuit_list[key];
                qviz.draw(circuit, element, qviz.STYLES['Default'])
            }
            \n`
            load_str += "</script>\n"
            page.content += load_str;
            return page;
        }
    }
};