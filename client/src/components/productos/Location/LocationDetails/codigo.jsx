import React, { useEffect, useState } from "react";
import { useProducts } from "../../../../contexts/ProductContext";
import ReactPaginate from "react-paginate";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
} from "docx";
import { saveAs } from "file-saver";
import "./LocationDetails.css";

const LocationDetails = () => {
  const { units, loadingUnits, errorUnits } = useProducts();
  const [groupedUnits, setGroupedUnits] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    if (units) {
      const grouped = units.reduce((acc, unit) => {
        const locationName = unit.location?.direccion;
        const productName = unit.id_producto?.name;

        if (!locationName || !productName) return acc;

        if (!acc[locationName]) {
          acc[locationName] = {
            responsable: unit.location?.recibido_por || "Desconocido",
            responsableEmail: unit.location?.email_recibido_por || "Desconocido",
            products: {},
             
          };
        }
        
         
        if (!acc[locationName].products[productName]) {
          acc[locationName].products[productName] = {
            product: unit.id_producto,
            count: 0,
          };
        }

        acc[locationName].products[productName].count += 1;

        return acc;
      }, {});

      setGroupedUnits(grouped);
    }
  }, [units]);

  useEffect(() => {
    const filteredUnits = Object.keys(groupedUnits).reduce(
      (acc, locationName) => {
        if (locationName.toLowerCase().includes(searchTerm.toLowerCase())) {
          acc[locationName] = groupedUnits[locationName];
        }
        return acc;
      },
      {}
    );

    const paginatedUnits = Object.keys(filteredUnits).slice(
      itemOffset,
      itemOffset + itemsPerPage
    );
    setCurrentItems(paginatedUnits);
    setPageCount(Math.ceil(Object.keys(filteredUnits).length / itemsPerPage));
  }, [searchTerm, groupedUnits, itemOffset]);

  const handlePageClick = (event) => {
    const newOffset =
      (event.selected * itemsPerPage) % Object.keys(groupedUnits).length;
    setItemOffset(newOffset);
  };

  const capitalizeWords = (text) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const generateWordDocument = async () => {
    try {
      // Suponiendo que 'formattedDate' es un objeto Date, si no lo es, conviértelo primero
      const date = new Date(); // o usa 'formattedDate' si ya tienes una fecha específica
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = date.toLocaleDateString("es-ES", options);
      const imageUrl = "/public/logoDocheader.png"; // Ruta relativa a la carpeta public
      const imageBlob = await fetch(imageUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Imagen no encontrada");
          return res.blob();
        })
        .catch((error) => {
          console.error("Error al obtener la imagen:", error);
          return null;
        });

      if (!imageBlob) {
        // Maneja el caso en que la imagen no se carga
        return;
      }

      const imageArrayBuffer = await imageBlob.arrayBuffer();

      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Medellín ${formattedDate}`,
                    bold: false,
                    size: 20,
                  }),
                ],
                alignment: "right",
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageArrayBuffer,
                    transformation: {
                      width: 600, // Ancho de la imagen
                      height: 100, // Alto de la imagen
                    },
                  }),
                ],
                alignment: "left", // Alineación a la izquierda
                spacing: { before: 100, after: 100 }, // Espaciado antes y después
              }),

              // Title
              new Paragraph({
                children: [
                  new TextRun({
                    text: "  ",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),

              ...currentItems
                .map((locationName) => {
                  const locationData = groupedUnits[locationName];

                  const locationParagraph = new Paragraph({
                    children: [
                      new TextRun({
                        text: "Ubicación: ",
                        size: 24, // Parte en negrita
                        bold: true,
                      }),
                      new TextRun({
                        text: `${locationName}`,
                        size: 24, // Parte sin negrita
                      }),
                    ],
                    heading: "HEADING_1",
                  });

                  const responsableParagraph = new Paragraph({
                    children: [
                      new TextRun({
                        text: `Asignaciones:`,
                        size: 24, // Parte en negrita
                        bold: true,
                      }),
                    ],
                  });
                  const responsableParagraphb = new Paragraph({
                    children: [
                      new TextRun({
                        text: ` `,
                        size: 24, // Parte en negrita
                        bold: true,
                      }),
                    ],
                  });

                  const productParagraphs = Object.keys(
                    locationData.products
                  ).map((productName) => {
                    const { product, count } =
                      locationData.products[productName];
                    return new Paragraph({
                      children: [
                        new TextRun({
                          text: `${count} Und: ${product?.name}:`,
                          size: 24, // Tamaño de letra (48 equivale a 24pt en Word)
                          bold: false, // Opcional: negrita
                          color: "000000", // Opcional: color negro
                        }),
                      ],
                    });
                  });

                  return [
                    locationParagraph,
                    responsableParagraph,
                    responsableParagraphb,
                    ...productParagraphs,
                  ];
                })
                .flat(),

              // Policies section
              new Paragraph({
                children: [
                  new TextRun({
                    text: " ",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              // Policy paragraphs with bullets
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Estimado docente y/o administrativo del colegio panamericano Colombo sueco, estas son las políticas del uso de los dispositivos dentro de la institución. Se debe responder por el dispositivo, correo electrónico u ordenador en caso de: ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "a.     Daño vandalismo o pérdida del dispositivo",
                    bold: false,
                    size: 24,
                  }),
                ],
                alignment: "left",
                spacing: { before: 100, after: 100 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "b.     Piratería o alteración",
                    bold: false,
                    size: 24,
                  }),
                ],
                alignment: "left",
                spacing: { before: 100, after: 100 },
                // bullet: { level: 0 },
                // indent: { left: 200 },
              }),

              new Paragraph({
                children: [
                  new TextRun({
                    text: "c.     Cualquier conducta que viole las reglas del colegio",
                    bold: false,
                    size: 24,
                  }),
                ],
                alignment: "left",
                spacing: { before: 100, after: 100 },
                // bullet: { level: 0 },
                // indent: { left: 200 },
              }),
              // Policies section
              new Paragraph({
                children: [
                  new TextRun({
                    text: " ",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              // Policies section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "  ",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "POLÍTICAS DE USO DE LAS CUENTAS DEL CORREO Y PLATAFORMA Q10",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              // Policies section
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Los usuarios son completamente responsables de todas las actividades con sus cuentas de acceso al buzón asignado por solicitud del colegio panamericano Colombo sueco. ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),

              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Es una falta grave facilitar su cuenta de correo electrónico (e-mail) a personas NO autorizadas, su cuenta es exclusiva del cargo o dependencia y no es transferible. ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "El correo electrónico es una herramienta para el intercambio de información entre personas, no es una herramienta de difusión masiva de información tipo spam o cadenas. ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "El correo institucional es para uso exclusivo de las actividades académicas o laborales, NO personales, la producción intelectual desarrollada en el DRIVE o en el correo es propiedad del colegio panamericano Colombo sueco. Al dejar de pertenecer al colegio panamericano sueco su correo institucional será suspendido. ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "El usuario y contraseña de la plataforma q10 serán asignados al ingresar laboralmente a la institución, al dejar de pertenecer al colegio panamericano Colombo sueco su usuario y contraseña serán suspendidos. ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Toda la producción desarrollada del currículum (planeación guías diagnósticos informes) deberán ser almacenadas en el correo institucional currículum@colomboseco.com.",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              // Policies section
              new Paragraph({
                children: [
                  new TextRun({
                    text: " ",
                    bold: true,
                    size: 20,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              // Policies section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "POLÍTICAS DE USO DE DISPOSITIVOS ELECTRÓNICOS CONECTADOS AL SERVIDOR DE LA INTERNET DEL COLEGIO",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              // Policies section
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Todos los dispositivos electrónicos del Colegio Panamericano Colombo Sueco serán entregados como dotación al personal y/o administrativo que lo necesite con una conexión estable y activa a la red del colegio panamericano Colombo sueco.",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),

              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Los usuarios son completamente responsables del uso, daño o pérdida de todos los dispositivos entregados por el colegio panamericano Colombo sueco para su función académica o administrativa. ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Al finalizar sus funciones los dispositivos deben ser entregados al departamento de sistemas u oficina de coordinación en el mismo estado en que se entregó y debe reportarse cualquier situación que afecte el correcto funcionamiento del dispositivo.",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Si el usuario trae dispositivo propio para el ejercicio de docente o administrativo no se hace responsable el colegio por daño alguno deterioro o pérdida. ",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Los dispositivos de propiedad personal no tendrán conexión a la red del colegio panamericano Colombo sueco.",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),

              // Policies section
              new Paragraph({
                children: [
                  new TextRun({
                    text: " ",
                    bold: true,
                    size: 20,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              // Policies section
              new Paragraph({
                children: [
                  new TextRun({
                    text: "COMPROMISO DE CONFIDENCIALIDAD",
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "center",
                spacing: { before: 200, after: 200 },
              }),
              // Policies section
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Además, con la firma del presente documento, me comprometo a abstenerme de revelar la información confidencial de la que tenga conocimiento, siendo consciente de las penas, multas y sanciones derivadas de este y del acuerdo de confidencialidad recíprocos suscrito entre este servidor y el colegio panamericano Colombo sueco contemplado en el contrato laboral.",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),

              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: "Por tanto me hago responsable de seguir las políticas de seguridad y procedimientos para el uso de acceso a la información,  evitando cualquier práctica o uso inapropiado que pudiera poner en peligro la información integridad y reputación de los sistemas de información de la institución, establecidos en el presente acuerdo de confidencialidad, con base en las normas legales sobre la protección de derechos fundamentales del habeas data, según lo dispuesto en el artículo 15 de la constitución política y la ley 1581 del 2012.",
                    bold: false,
                    size: 24,
                  }),
                ],

                spacing: { before: 200, after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: " ",
                    bold: false,
                    size: 24,
                  }),
                ],
                alignment: "left",
                spacing: { before: 200, after: 200 },
              }),

              ...currentItems
                .map((locationName) => {
                  const locationDataB = groupedUnits[locationName];
                  
                  const firmaResponsableAParagraph = new Paragraph({
                    children: [
                      new TextRun({
                        text: ` `,
                        size: 24, // Parte en negrita
                        bold: true,
                      }),
                      new TextRun({
                        text: `  `,
                        size: 24, // Parte sin negrita
                      }),
                    ],

                    alignment: "left",
                    spacing: { before: 200, after: 200 },
                  });
                  const firmaResponsableParagraph = new Paragraph({
                    children: [
                      new TextRun({
                        text: `Responsable:`,
                        size: 24, // Parte en negrita
                        bold: true,
                      }),
                      new TextRun({
                        text: ` ${capitalizeWords(locationDataB.responsable)}`,
                        size: 24, // Parte sin negrita
                      }),
                    ],

                    alignment: "left",
                    spacing: { before: 200, after: 200 },
                  });
                  const emailfirmaResponsableParagraph = new Paragraph({
                    children: [
                      new TextRun({
                        text: `Email:`,
                        size: 24, // Parte en negrita
                        bold: true,
                      }),
                      new TextRun({
                        text: ` ${locationDataB.responsableEmail}`,
                        size: 24, // Parte sin negrita
                      }),
                    ],

                    alignment: "left",
                    spacing: { before: 200, after: 200 },
                  });
                  const fechaParagraph = new Paragraph({
                    children: [
                      new TextRun({
                        text: `Firma: _____________________________`,
                        size: 24, // Parte sin negrita
                      }),
                    ],
                    alignment: "left",
                    spacing: { before: 200, after: 400 },
                  });

                  return [
                    firmaResponsableAParagraph,
                    firmaResponsableParagraph,
                    emailfirmaResponsableParagraph,
                    fechaParagraph,
                  ];
                })
                .flat(),
            ],
          },
        ],
      });

      // File name using the responsible person's name
      const responsableNom = capitalizeWords(
        groupedUnits[currentItems[0]].responsable
      );

      const fileName = `${responsableNom} asignaciones.docx`;

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, fileName); // Use custom file name
      });
    } catch (error) {
      console.error("Error al generar el documento Word:", error);
    }
  };

  return (
    <>
      <h2>Asignaciones por ubicación</h2>

      {loadingUnits && <p>Cargando unidades...</p>}
      {errorUnits && <p>Error al cargar las unidades</p>}

      <div className="location-container-list">
        <div className="location-container-list-header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar ubicación"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setItemOffset(0);
              }}
            />
          </div>
          <div>
            <button
              className="generate-doc-btn-word"
              onClick={generateWordDocument}
            >
              Generar Documento
            </button>
          </div>
        </div>

        {currentItems.length > 0 ? (
          currentItems.map((locationName) => {
            const {responsable, responsableEmail, product} =  groupedUnits[locationName];
    
            return (
              <div key={locationName} className="location-card-details">
                <h3 className="location-title">{locationName}</h3>
                <p className="responsable">Responsable: {responsable}</p>
                {/* <p className="responsable_email">Email: {responsableEmail}
                </p> */}
                {Object.keys(groupedUnits[locationName].products).map(
                  (productName) => {
                    const { product, count } =
                      groupedUnits[locationName].products[productName];
                    return (
                      <div key={product?._id} className="product-card-details">
                        <p className="product-name">{product?.name}</p>
                        <p className="product-quantity">{count} und</p>
                      </div>
                    );
                  }
                )}
              </div>
            );
          })
        ) : (
          <p>No se encontraron unidades</p>
        )}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel="Siguiente"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        previousLabel="Anterior"
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
    </>
  );
};

export default LocationDetails;
