export class Categories {
  constructor(categoriesConfig) {
    this.categoriesConfig = categoriesConfig;

    const params = new URLSearchParams(window.location.search);

    const category = params.get('category');
    const subCategory = params.get('sub-category');

    this.selectedCategory = category;
    this.selectedSubCategory = subCategory;
    this.wrap = document.createElement('div');
  }

  downloadPDF(markdownText, fileName) {
    // Convert Markdown to HTML
    var htmlContent = marked.parse(markdownText);

    // Create a new jsPDF instance
    var pdf = new jspdf.jsPDF();

    // Convert HTML to PDF
    pdf.html(htmlContent, {
      callback: function () {
        // Save the PDF file
        pdf.save(fileName);
      },
      windowWidth: 1920,
      x: 10,
      y: 10,
    });
  }

  onCategorySelect(categoryId) {
    this.selectedCategory = categoryId;

    // var searchParams = new URLSearchParams(window.location.search);
    // searchParams.set('category', categoryId);
    // window.location.search = searchParams.toString();
  }

  renderSubCategories(subCategories) {
    //TODO: ref to createBackBtn
    const backBtn = document.createElement('button');
    backBtn.innerHTML = 'Back';
    backBtn.addEventListener('click', () => {
      this.renderCategories();
    });
    backBtn.className = 'btn btn-primary mb-2';
    this.wrap.innerHTML = '';

    this.wrap.appendChild(backBtn);

    const contentWrap = document.createElement('div');
    contentWrap.className = 'list-group';

    subCategories.map((subCategory) => {
      const subCategoryWrap = document.createElement('button');
      subCategoryWrap.className = 'list-group-item list-group-item-action';
      subCategoryWrap.innerHTML = subCategory.title;
      subCategoryWrap.type = 'button';

      subCategoryWrap.addEventListener('click', () => {
        // fetch('./files/' + subCategory.contentFileName)
        //   .then((res) => res.text())
        //   .then(this.renderContent.bind(this, subCategories))
        //   .catch((e) => console.error(e));

        this.renderContent.bind(
          this,
          subCategories,
          subCategory.contentFileName
        )();
      });

      contentWrap.appendChild(subCategoryWrap);
    });

    this.wrap.appendChild(contentWrap);
  }

  renderContent(subCategories, content) {
    this.wrap.innerHTML = '';

    //TODO: ref to createBackBtn
    const backBtn = document.createElement('button');
    backBtn.innerHTML = 'Back';
    backBtn.addEventListener('click', () => {
      this.renderSubCategories(subCategories);
    });
    backBtn.className = 'btn btn-primary mb-2 me-2';

    const downloadPDFBtn = document.createElement('a');
    downloadPDFBtn.innerHTML = 'Download PDF';
    downloadPDFBtn.download = content;
    downloadPDFBtn.href = './files/' + content;

    downloadPDFBtn.className = 'btn btn-primary mb-2';

    this.wrap.appendChild(backBtn);
    this.wrap.appendChild(downloadPDFBtn);

    // const md = document.createElement('div');
    // // const mdShadow = md.attachShadow({ mode: 'open' });
    // md.innerHTML = marked.parse(content);

    const pdfViewer = document.createElement('div');
    pdfViewer.className = 'w-100 overflow-auto border rounded shadow';
    pdfViewer.style.height = 'calc(100vh - 46px - 48px)';

    pdfjsLib.getDocument('./files/' + content).promise.then(function (pdf) {
      for (var pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        pdf.getPage(pageNumber).then(function (page) {
          var scale = 1.5;
          var viewport = page.getViewport({ scale: scale });

          var canvas = document.createElement('canvas');
          var context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          pdfViewer.appendChild(canvas);

          page.render({
            canvasContext: context,
            viewport: viewport,
          });
        });
      }
    });

    this.wrap.appendChild(pdfViewer);
  }

  renderCategories() {
    this.wrap.innerHTML = '';
    const categoryWrap = document.createElement('div');
    categoryWrap.className = 'list-group';
    this.categoriesConfig.map((category) => {
      const categoryItem = document.createElement('button');
      categoryItem.className = 'list-group-item list-group-item-action';
      categoryItem.innerHTML = category.title;
      categoryItem.type = 'button';

      categoryItem.addEventListener('click', () => {
        this.renderSubCategories(category.subCategories);
      });
      categoryWrap.appendChild(categoryItem);
    });
    this.wrap.appendChild(categoryWrap);
  }

  render() {
    this.renderCategories();

    return this.wrap;
  }
}
