$(document).ready(function () {

    $("#headerTitle").hide(300).show(1500);
    // calling show food menu function
    showFoodMenu();
    
    // If you want to fetch data from the file 
    // call fetch data function instead of showFoodMenu
    // fetchData()
});

function fetchData() {
    setTimeout(function () {
        showFoodMenu();
        // recursive call
        fetchData();
    }, 3000);
}

function showFoodMenu() {
    $.ajax({
        url: "./oops_response.xml",
        type: "GET",
        datatype: "xml",

        error: function (e) {
            alert("An error occured while processing XML file.");
            console.log("XML reading failed: ", e);
        },

        success: function (response) {
            $("#pitfalls").children().remove();

            var _highest_importance_num = 0;

            $(response).find("oops\\:Pitfall").each(function () {
                var _code = $(this).find("oops\\:Code").text();
                console.log(_code)
                
                var _name = 'Name: ' + $(this).find("oops\\:Name").text();
                var _description = $(this).find("oops\\:Description").text();
                var _importance = $(this).find("oops\\:Importance").text();
                var _numberAffectedElements = $(this).find("oops\\:NumberAffectedElements").text();
                var _textAffectedElements;
                if (_numberAffectedElements == '') {
                    _textAffectedElements = 'Ontology';
                }
                else {
                    _textAffectedElements = _numberAffectedElements + ' cases';
                }
                var _importance_spanclass;
                if (_importance == 'Minor') {
                    _importance_spanclass = 'bg-warning';
                    _highest_importance_num = Math.max(_highest_importance_num, 1);
                }
                else if (_importance == 'Important') {
                    _importance_spanclass = 'bg-important';
                    _highest_importance_num = Math.max(_highest_importance_num, 2);
                }
                else if (_importance == 'Critical') {
                    _importance_spanclass = 'bg-danger';
                    _highest_importance_num = Math.max(_highest_importance_num, 3);
                    
                }
                var _affected = '';

                $(this).find("oops\\:AffectedElement").each(function () {
                    if (_affected == '') {
                        _affected = '<div><b>Affected Elements:</b><ul>';
                    }
                    _affected = _affected + "<li>" + $(this).text() + "</li>";
                })
                _affected = _affected + "</ul></div>";

                var _div = "<div class=\"accordion-item\">" +
                "<h3 class=\"accordion-header\" id=\"heading" + _code + "\">" +
                "  <button class=\"accordion-button\" style=\"display: inline;\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse" + _code + "\" aria-expanded=\"true\" aria-controls=\"collapse" + _code + "\">" +
                "    " + _code + " - " + _name + "<span class=\"badge badge-float " + _importance_spanclass + "\">" + _importance + "</span><span class=\"float\">" + _textAffectedElements + "</span>" +
                "  </button>" +
                "</h3>" +
                "<div id=\"collapse" + _code + "\" class=\"accordion-collapse collapse show\" aria-labelledby=\"heading" + _code + "\" data-bs-parent=\"#accordionExample\">" +
                "  <div class=\"accordion-body\">" +
                "    " + _description + "<br /></p>" + _affected  +
                "  </div>" +
                "</div>" +
                "</div>"

                $("#pitfalls").append(_div);
            });

            var _suggestioncount = 0;
            $(response).find("oops\\:Suggestion").each(function () {
                _suggestioncount++;
                var _name = $(this).find("oops\\:Name").text();
                var _description = $(this).find("oops\\:Description").text();
                var _affected = '';
                $(this).find("oops\\:AffectedElement").each(function () {
                    if (_affected == '') {
                        _affected = '<div><b>Affected Elements:</b><ul>';
                    }
                    _affected = _affected + "<li>" + $(this).text() + "</li>";
                })
                _affected = _affected + "</ul></div>";
                var _div = "<div class=\"accordion-item\">" +
                "<h3 class=\"accordion-header\" id=\"heading" + _suggestioncount + "\">" +
                "  <button class=\"accordion-button\" style=\"display: inline;\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#collapse" + _suggestioncount + "\" aria-expanded=\"true\" aria-controls=\"collapse" + _suggestioncount + "\">" +
                "    " + _name +
                "  </button>" +
                "</h3>" +
                "<div id=\"collapse" + _suggestioncount + "\" class=\"accordion-collapse collapse show\" aria-labelledby=\"heading" + _suggestioncount + "\" data-bs-parent=\"#accordionExample\">" +
                "  <div class=\"accordion-body\">" +
                "    " + _description + "<br /></p>" + _affected  +
                "  </div>" +
                "</div>" +
                "</div>"

                $("#suggestions").append(_div);
            });

            // set conformance badge
            if (_highest_importance_num == 0) {
                $("#conformanceBadgeText").text("Pitfall free");
                $("#conformanceBadgeImage").attr("src","https://oops.linkeddata.es/images/conformance/oops_free.png");
                $("#conformanceBadgeImage").attr("alt", "No pitfalls were found");
            }
            else if (_highest_importance_num == 1) {
                $("#conformanceBadgeText").text("Minor pitfalls");
                $("#conformanceBadgeImage").attr("src","https://oops.linkeddata.es/images/conformance/oops_minor.png");
                $("#conformanceBadgeImage").attr("alt", "Minor pitfalls were found");
            }
            else if (_highest_importance_num == 2) {
                $("#conformanceBadgeText").text("Important pitfalls");
                $("#conformanceBadgeImage").attr("src","https://oops.linkeddata.es/images/conformance/oops_important.png");
                $("#conformanceBadgeImage").attr("alt", "Important pitfalls were found");
            }
            else {
                $("#conformanceBadgeText").text("Critical pitfalls");
                $("#conformanceBadgeImage").attr("src","https://oops.linkeddata.es/images/conformance/oops_critical.png");
                $("#conformanceBadgeImage").attr("alt", "Critical pitfalls were found");
            }
        }
    });
}