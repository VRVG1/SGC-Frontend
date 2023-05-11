function Option({value, txt}) {
    return (
        <option value={value}>
            {txt}
        </option>
    );
}

export default function Menu({
               labelTxt,
               selectId,
               selectName,
               selectFn,
               selectValue,
               defaultOptionTxt,
               optionsList,
               optKey,
               optValue,
               optTxt,
               hidden = true
              }) {
    return hidden ? "" : (
        <div>
            <label htmlFor={selectId}>
                { labelTxt }
            </label>
            <select
                name={ selectName }
                id={ selectId }
                onChange={ selectFn }
                value={ selectValue }
            >
                <option value="">{ defaultOptionTxt }</option>
                {
                    optionsList.length === 0 ? "" : optionsList.map(option => (
                        <Option
                            key={ option[optKey] }
                            value={ option[optValue] }
                            txt={ option[optTxt] } />
                ))}
            </select>
        </div>
    );
}

