import Modal from "../routes/modal/Modal";
import Menu from "./Menu";

const Button = ({className, handler, disabled, children}) => {
    return (
        <button
            className={className}
            onClick={handler}
            disabled={disabled}
        >
            <span>{children}</span>
        </button>
    )
}

const ButtonList = ({buttons}) => {
    return buttons.map(elemData => {
        let element = "";
        let button = elemData;
        element = (
            <Button
                key={button.id}
                className={button.className === undefined ? "" : button.className}
                handler={button.handler}
                disabled={button.disabled === undefined ? false : button.disabled}
            >
                {button.btnTxt}
            </Button>
        );
        return element;
    });
}

const BloqueBotones = ({buttons}) => {
    return (
        <div className="data__body__buttons">
            <ButtonList buttons={buttons} />
        </div>
    );
}

const ModalContent = ({
    buttons,
    classForModalContent="",
    classForModalContentButtons="",
    children
}) => {
    return (
        <div className={`${classForModalContent} modal__content`}>
            {children}
            <div className={`${classForModalContentButtons} modal__content__buttons`}>
                <ButtonList buttons={buttons} />
            </div>
        </div>
    )
}

function InterfazRegistros({
    guiTitle,
    buttonsDataBody,
    modalAgregarModificar,
    classForModalContent="",
    classForModalContentButtons="",
    buttonsModalAgregarModificar,
    formulario,
    modalEliminar,
    buttonsModalEliminar,
    children
}) {
    return (
        <>
            <div className="data">
                <div className="data__header">
                    <h1>{guiTitle}</h1>
                </div>
                <div className="data__body container">
                    {children}
                    <BloqueBotones
                        buttons={buttonsDataBody}
                    />
                </div>
            </div>
            <Modal
                show={modalAgregarModificar.show}
                setShow={modalAgregarModificar.setShow}
                title={modalAgregarModificar.title}
            >
                <ModalContent
                    classForModalContent={classForModalContent}
                    classForModalContentButtons={classForModalContentButtons}
                    buttons={buttonsModalAgregarModificar}
                >
                    {formulario}
                </ModalContent>
            </Modal>
            <div className="pnc__modal">
                <Modal
                    show={modalEliminar.show}
                    setShow={modalEliminar.setShow}
                    title={modalEliminar.title}
                >
                    <ModalContent
                        buttons={buttonsModalEliminar}
                    >
                        {""}
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}

export {InterfazRegistros as default, Button};
