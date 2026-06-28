from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Flowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "entrega"
OUT_DIR.mkdir(exist_ok=True)
PDF_PATH = OUT_DIR / "Entrega_Final_Inatel_Conecta_Gabriel_Ribeiro.pdf"
PROJECT_URL = "https://gakothecreator.github.io/S05---Repositorio/"

BLUE = colors.HexColor("#065cbe")
NAVY = colors.HexColor("#071838")
MUTED = colors.HexColor("#5f6f86")
LINE = colors.HexColor("#d9e2ef")
PALE = colors.HexColor("#f4f8ff")
GREEN = colors.HexColor("#087a3c")
CORAL = colors.HexColor("#ef4d43")


def styles():
    base = getSampleStyleSheet()
    base.add(
        ParagraphStyle(
            name="CoverTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=26,
            leading=31,
            textColor=NAVY,
            alignment=TA_LEFT,
            spaceAfter=12,
        )
    )
    base.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=NAVY,
            spaceAfter=10,
        )
    )
    base.add(
        ParagraphStyle(
            name="SubTitle",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=BLUE,
            spaceBefore=8,
            spaceAfter=5,
        )
    )
    base.add(
        ParagraphStyle(
            name="Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=colors.HexColor("#243247"),
            spaceAfter=6,
        )
    )
    base.add(
        ParagraphStyle(
            name="Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10.5,
            textColor=MUTED,
        )
    )
    base.add(
        ParagraphStyle(
            name="CenterSmall",
            parent=base["Small"],
            alignment=TA_CENTER,
        )
    )
    return base


S = styles()


def p(text, style="Body"):
    return Paragraph(text, S[style])


def image(path, max_w, max_h):
    source = ROOT / path
    with PILImage.open(source) as img:
        w, h = img.size
    scale = min(max_w / w, max_h / h)
    return Image(str(source), width=w * scale, height=h * scale)


class PhoneWireframe(Flowable):
    def __init__(self, title, elements):
        super().__init__()
        self.title = title
        self.elements = elements
        self.width = 5.0 * cm
        self.height = 9.0 * cm

    def draw(self):
        c = self.canv
        c.setStrokeColor(LINE)
        c.setFillColor(colors.white)
        c.roundRect(0, 0, self.width, self.height, 18, fill=1, stroke=1)
        c.setFillColor(PALE)
        c.roundRect(0.25 * cm, self.height - 1.05 * cm, self.width - 0.5 * cm, 0.55 * cm, 8, fill=1, stroke=0)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 7)
        c.drawCentredString(self.width / 2, self.height - 0.72 * cm, self.title)
        y = self.height - 1.55 * cm
        for kind, label in self.elements:
            if kind == "hero":
                h = 1.15 * cm
                c.setFillColor(PALE)
                c.roundRect(0.35 * cm, y - h, self.width - 0.7 * cm, h, 8, fill=1, stroke=1)
                c.setFillColor(BLUE)
                c.circle(0.75 * cm, y - 0.55 * cm, 0.18 * cm, fill=1, stroke=0)
            elif kind == "row":
                h = 0.7 * cm
                c.setFillColor(colors.white)
                c.roundRect(0.35 * cm, y - h, self.width - 0.7 * cm, h, 6, fill=1, stroke=1)
            elif kind == "chat_user":
                h = 0.62 * cm
                c.setFillColor(BLUE)
                c.roundRect(1.4 * cm, y - h, self.width - 1.75 * cm, h, 7, fill=1, stroke=0)
            elif kind == "chat_bot":
                h = 0.62 * cm
                c.setFillColor(PALE)
                c.roundRect(0.35 * cm, y - h, self.width - 1.75 * cm, h, 7, fill=1, stroke=1)
            elif kind == "button":
                h = 0.72 * cm
                c.setFillColor(BLUE)
                c.roundRect(0.35 * cm, y - h, self.width - 0.7 * cm, h, 7, fill=1, stroke=0)
            else:
                h = 0.45 * cm
                c.setStrokeColor(LINE)
                c.line(0.35 * cm, y - h / 2, self.width - 0.35 * cm, y - h / 2)
            c.setFillColor(MUTED if kind != "chat_user" and kind != "button" else colors.white)
            c.setFont("Helvetica", 5.8)
            text_x = 1.55 * cm if kind == "chat_user" else 0.55 * cm
            max_chars = 22 if kind == "chat_user" else 32
            c.drawString(text_x, y - 0.42 * cm, label[:max_chars])
            y -= h + 0.25 * cm


class ClassDiagram(Flowable):
    def __init__(self):
        super().__init__()
        self.width = 17 * cm
        self.height = 15 * cm

    def box(self, c, x, y, w, h, title, lines):
        c.setStrokeColor(LINE)
        c.setFillColor(colors.white)
        c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
        c.setFillColor(BLUE)
        c.roundRect(x, y + h - 0.62 * cm, w, 0.62 * cm, 8, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(x + 0.18 * cm, y + h - 0.42 * cm, title)
        c.setFillColor(NAVY)
        c.setFont("Helvetica", 6.5)
        cursor = y + h - 0.9 * cm
        for line in lines:
            c.drawString(x + 0.18 * cm, cursor, line)
            cursor -= 0.32 * cm

    def arrow(self, c, x1, y1, x2, y2, label):
        c.setStrokeColor(MUTED)
        c.line(x1, y1, x2, y2)
        c.setFillColor(MUTED)
        c.setFont("Helvetica", 6)
        c.drawCentredString((x1 + x2) / 2, (y1 + y2) / 2 + 0.08 * cm, label)

    def draw(self):
        c = self.canv
        bw, bh = 4.7 * cm, 3.0 * cm
        self.box(c, 0.1 * cm, 11.1 * cm, bw, bh, "Aluno", ["+id", "+nome", "+curso", "+abrirAtendimento()", "+enviarMensagem()"])
        self.box(c, 6.1 * cm, 11.1 * cm, bw, bh, "Atendimento", ["+id", "+status", "+canal", "+iniciar()", "+encerrar()"])
        self.box(c, 12.1 * cm, 11.1 * cm, bw, bh, "AtendenteVirtual", ["+id", "+nome", "+prepararResposta()", "+encaminhar()"])
        self.box(c, 3.1 * cm, 6.5 * cm, bw, bh, "Mensagem", ["+id", "+texto", "+autor", "+dataHora", "+validarInput()"])
        self.box(c, 9.1 * cm, 6.5 * cm, bw, bh, "Solicitação", ["+id", "+categoria", "+prioridade", "+registrar()", "+atualizarStatus()"])
        self.box(c, 0.1 * cm, 1.9 * cm, bw, bh, "Notificação", ["+id", "+tipo", "+conteudo", "+enviarFeedback()"])
        self.box(c, 12.1 * cm, 1.9 * cm, bw, bh, "PreferenciaTema", ["+modo", "+salvarModo()", "+alternarTema()"])
        self.arrow(c, 4.8 * cm, 12.6 * cm, 6.1 * cm, 12.6 * cm, "abre")
        self.arrow(c, 10.8 * cm, 12.6 * cm, 12.1 * cm, 12.6 * cm, "usa")
        self.arrow(c, 8.45 * cm, 11.1 * cm, 5.45 * cm, 9.5 * cm, "possui")
        self.arrow(c, 8.45 * cm, 11.1 * cm, 11.45 * cm, 9.5 * cm, "gera")
        self.arrow(c, 9.1 * cm, 6.5 * cm, 4.8 * cm, 4.9 * cm, "notifica")
        self.arrow(c, 2.4 * cm, 11.1 * cm, 14.4 * cm, 4.9 * cm, "define")


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setAuthor("Gabriel Ribeiro")
    canvas.setTitle("Inatel Conecta - Assistencia no App")
    canvas.setSubject("Projeto de interface para a disciplina Homem-Maquina")
    canvas.setFillColor(BLUE)
    canvas.setFont("Helvetica-BoldOblique", 15)
    canvas.drawString(1.5 * cm, A4[1] - 1.1 * cm, "Inatel")
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawRightString(A4[0] - 1.5 * cm, 0.9 * cm, f"Gabriel Ribeiro - Página {doc.page}")
    canvas.restoreState()


def info_table(rows, widths=None):
    formatted_rows = [[Paragraph(str(cell), S["Small"]) for cell in row] for row in rows]
    table = Table(formatted_rows, colWidths=widths)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PALE),
                ("TEXTCOLOR", (0, 0), (-1, 0), NAVY),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.2),
                ("LEADING", (0, 0), (-1, -1), 10),
                ("GRID", (0, 0), (-1, -1), 0.4, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#fbfdff")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 7),
                ("RIGHTPADDING", (0, 0), (-1, -1), 7),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def build():
    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        rightMargin=1.45 * cm,
        leftMargin=1.45 * cm,
        topMargin=1.55 * cm,
        bottomMargin=1.35 * cm,
    )
    story = []

    story += [
        Spacer(1, 0.4 * cm),
        p("Inatel Conecta - Assistência no App", "CoverTitle"),
        p("<b>Aluno:</b> Gabriel Ribeiro &nbsp;&nbsp; <b>Matrícula:</b> 20231234", "Body"),
        p(
            "<b>Justificativa:</b> a funcionalidade centraliza atendimento acadêmico, avisos e serviços recorrentes do aluno em uma experiência responsiva. A proposta reduz esforço de navegação, oferece feedback imediato no chat e mantém uma identidade visual próxima ao app do Inatel.",
            "Body",
        ),
        p("<b>Funcionamento:</b> o usuário acessa o app, alterna entre tema claro/escuro, abre o atendimento, envia uma dúvida e recebe retorno visual do sistema. Vagas e candidatura permanecem como recurso complementar, mas o foco da entrega é assistência.", "Body"),
        p(f"<b>Link para visualização:</b> {PROJECT_URL}", "Body"),
        Spacer(1, 0.25 * cm),
        p("Telas do projeto", "SubTitle"),
    ]
    shots = Table(
        [
            [
                image(".qa/mobile-home.png", 5.1 * cm, 10.1 * cm),
                image(".qa/mobile-atendimento-resposta.png", 5.1 * cm, 10.1 * cm),
                image(".qa/mobile-home-dark.png", 5.1 * cm, 10.1 * cm),
            ],
            [p("Home com assistência em destaque", "CenterSmall"), p("Chat com input e feedback", "CenterSmall"), p("Tema escuro", "CenterSmall")],
        ],
        colWidths=[5.4 * cm, 5.4 * cm, 5.4 * cm],
    )
    shots.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("ALIGN", (0, 0), (-1, -1), "CENTER")]))
    story += [shots, PageBreak()]

    story += [
        p("User Story", "SectionTitle"),
        p("<b>Como</b> aluno do Inatel que usa o app para resolver pendências acadêmicas, <b>quero</b> acessar um atendimento assistido, enviar minha dúvida e receber orientação imediata, <b>para</b> resolver solicitações com menos navegação e mais clareza.", "Body"),
        p("Persona e contexto", "SubTitle"),
        p("Gabriel é aluno de Engenharia de Software, consulta avisos pelo celular e precisa tirar dúvidas rápidas sobre documentos, frequência, avaliações e solicitações acadêmicas. Ele alterna entre ambientes claros e escuros conforme o horário de uso.", "Body"),
        p("Critérios de aceitação", "SubTitle"),
        info_table(
            [
                ["Critério", "Comportamento esperado"],
                ["Acesso ao atendimento", "A home apresenta o atendimento como ação principal e o menu inferior oferece acesso direto ao chat."],
                ["Entrada de dados", "O aluno digita uma mensagem no campo do chat e envia pelo botão com ícone de envio."],
                ["Processamento", "O sistema registra a mensagem e retorna uma orientação após curto intervalo."],
                ["Feedback", "A conversa mostra mensagens, horário, confirmação visual e estado online do atendente virtual."],
                ["Tema", "O usuário alterna entre tema claro e escuro por botão visível na tela inicial e no topo desktop."],
                ["Responsividade", "A interface mantém navegação e leitura adequadas em telas mobile e desktop."],
            ],
            [4.2 * cm, 12.0 * cm],
        ),
        PageBreak(),
    ]

    story += [
        p("Análise da Tarefa", "SectionTitle"),
        p("Objetivo geral: obter assistência acadêmica no aplicativo do Inatel.", "Body"),
        info_table(
            [
                ["Nível", "Submeta/operação", "Descrição"],
                ["0", "Resolver solicitação acadêmica", "Aluno usa o app para registrar uma dúvida e receber orientação."],
                ["1.1", "Entrar no app", "Informar matrícula/senha e acessar a home."],
                ["1.2", "Ajustar preferência visual", "Alternar tema claro/escuro se desejar melhorar conforto de leitura."],
                ["1.3", "Localizar atendimento", "Usar card principal da home ou aba Atendimento no menu inferior."],
                ["1.4", "Enviar mensagem", "Digitar a dúvida no campo de texto e acionar Enviar."],
                ["1.5", "Aguardar processamento", "Sistema registra a solicitação e prepara uma resposta simulada."],
                ["1.6", "Interpretar feedback", "Aluno lê o retorno do atendimento, horários e confirmação visual da mensagem."],
                ["1.7", "Continuar navegação", "Aluno pode voltar à home, abrir avisos ou consultar serviços complementares."],
            ],
            [1.6 * cm, 4.7 * cm, 9.9 * cm],
        ),
        Spacer(1, 0.3 * cm),
        p("Entradas, processamento e feedback", "SubTitle"),
        info_table(
            [
                ["Entrada", "Processamento", "Feedback"],
                ["Credenciais de login", "Validação simulada de campos preenchidos", "Avanço para home ou mensagem de erro"],
                ["Mensagem no chat", "Registro e retorno após intervalo", "Nova bolha de atendimento e horário da resposta"],
                ["Alternância de tema", "Atualização do estado de interface", "Mudança imediata entre claro e escuro"],
            ],
            [4.8 * cm, 5.8 * cm, 5.6 * cm],
        ),
        PageBreak(),
    ]

    story += [
        p("Fluxo de Informação - Diagrama de Classes", "SectionTitle"),
        p("O fluxo representa a funcionalidade de atendimento assistido, incluindo aluno, chat, mensagens, solicitação, notificações e preferência de tema.", "Body"),
        ClassDiagram(),
        PageBreak(),
    ]

    story += [
        p("Wireframes", "SectionTitle"),
        p("Os wireframes abaixo representam a estrutura planejada antes do refinamento visual: acesso ao atendimento na home, conversa assistida e preferência de tema.", "Body"),
        Table(
            [
                [
                    PhoneWireframe("Home", [("hero", "Saudação do aluno"), ("hero", "Atendente virtual online"), ("row", "Card: atendimento online"), ("row", "Serviços do aluno"), ("row", "Avisos / Notas")]),
                    PhoneWireframe("Atendimento", [("chat_bot", "Mensagem do atendente"), ("chat_user", "Dúvida do aluno"), ("chat_bot", "Resposta com orientação"), ("line", "Campo de digitação"), ("button", "Enviar")]),
                    PhoneWireframe("Tema", [("hero", "Botão claro/escuro"), ("hero", "Home em modo escuro"), ("row", "Serviços com contraste"), ("row", "Menu inferior"), ("line", "Feedback visual imediato")]),
                ]
            ],
            colWidths=[5.4 * cm, 5.4 * cm, 5.4 * cm],
        ),
        Spacer(1, 0.35 * cm),
        p("Fidelidade com a interface final", "SubTitle"),
        p("A interface final mantém a hierarquia dos wireframes: ação principal de atendimento, lista de serviços, navegação inferior mobile e feedback visual após input do usuário. O refinamento adiciona identidade visual do Inatel, estados de interação, contraste e tema escuro.", "Body"),
    ]

    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print(PDF_PATH)


if __name__ == "__main__":
    build()
