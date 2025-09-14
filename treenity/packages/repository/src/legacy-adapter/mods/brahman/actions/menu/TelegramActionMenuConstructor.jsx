import { mapValues } from '@s-libs/micro-dash';
import { Button } from 'antd';
import arrayMove from 'array-move';
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { CurrentNode } from '../../../../tree/base/CurrentNodeContext';
import { RenderMeta } from '../../../../tree/ui/render-meta';
import { produce } from '../../../../utils/immer';
import TString from '../translate/TString';
import { TelegramActionMenu, TelegramMenuButton, TelegramMenuRow } from './TelegramActionMenu.meta';
import TelegramActionMenuButtonModal from './TelegramActionMenuButtonModal';
import './Menu.css';

const maxWidth = 480;

const T = TelegramActionMenu.Type;

export const TelegramActionMenuConstructor = ({ value, onChange, ...props }) => {
  const change = rows => {
    onChange(
      produce(value, value => {
        value.rows = rows;
      }),
    );
  };
  const changeType = menuType => {
    onChange(
      produce(value, value => {
        value.menuType = menuType;
      }),
    );
  };
  return (
    <>
      <RenderMeta type={T} value={value.menuType} onChange={changeType} context="react form" />
      {[T.KEYBOARD, T.INLINE_NEW, T.INLINE, T.INLINE_CLOSE].includes(value.menuType) && (
        <RenderMeta
          {...props}
          type={[TelegramMenuRow]}
          value={value.rows}
          onChange={change}
          context="react form"
        />
      )}
    </>
  );
};

const emptyDroppable = rowIdx => (
  <Droppable
    key={rowIdx}
    droppableId={`${rowIdx}`}
    direction="horizontal"
    ignoreContainerClipping={true}
  >
    {(provided, snapshot) => (
      <div
        style={{ height: 4, backgroundColor: snapshot.isDraggingOver ? '#40a9ff' : undefined }}
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export class TelegramActionMenuRows extends React.PureComponent {
  state = {
    modalVisible: false,
    width: maxWidth,
  };

  static contextType = CurrentNode;

  showModal = button => {
    this.setState({
      modalVisible: true,
      button,
    });
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  createId() {
    let id = 0;
    this.props.value.forEach(r =>
      r.buttons.forEach(b => {
        if (id <= b.id) id = b.id + 1;
      }),
    );
    return id;
  }

  update(updater, rowsChanged) {
    let rows = produce(this.props.value, updater);
    if (rowsChanged) {
      rows = rows.filter(r => r.buttons.length !== 0);
    }

    this.props.onChange(rows);
  }

  addButton = () => {
    this.update(rows => {
      const id = this.createId();

      const nb = new TString({ en: `Button ${id}` });

      rows.push(
        new TelegramMenuRow({
          buttons: [
            new TelegramMenuButton({
              title: nb,
              id,
            }),
          ],
        }),
      );
    }, true);
  };

  getIndexes = id => {
    const rows = this.props.value;
    let row = 0;
    let col = 0;
    for (let i = 0; i < rows.length; i++) {
      for (let j = 0; j < rows[i].buttons.length; j++) {
        if (rows[i].buttons[j].id === id) {
          row = i;
          col = j;
        }
      }
    }
    return { row, col };
  };

  saveButton = upd => {
    // fix if it have spaces, it can't be found if clicked
    upd = produce(upd, upd => {
      upd.title = mapValues(upd.title, v => v && v.trim());
    });

    this.update(rows => {
      const { row, col } = this.getIndexes(upd.id);

      rows[row].buttons[col] = upd;
    });
  };

  delButton = id => {
    this.update(rows => {
      const { row, col } = this.getIndexes(id);
      rows[row].buttons.splice(col, 1);
    }, true);
  };

  onDrag = update => {
    const { destination, source } = update;
    if (!destination) {
      return;
    }

    const destId = destination.droppableId;
    const srcId = source.droppableId;

    this.update(rows => {
      if (destId >= 100) {
        // insert new row
        let dest = destId - 100;
        const oldRow = rows[srcId].buttons;
        rows.splice(dest, 0, new TelegramMenuRow({ buttons: [oldRow[source.index]] }));
        oldRow.splice(source.index, 1);
      } else if (srcId !== destId) {
        const oldRow = rows[srcId].buttons;
        const newRow = rows[destId].buttons;

        newRow.splice(destination.index, 0, oldRow[source.index]);
        oldRow.splice(source.index, 1);
      } else {
        const row = rows[srcId].buttons;
        arrayMove.mutate(row, source.index, destination.index);
      }
    }, true);
  };

  setWidth = div => {
    this.div = div;
  };

  componentDidMount() {
    this.setState({ width: this.div.clientWidth });
  }

  render() {
    const { width } = this.state;
    const rows = this.props.value;
    const node = this.context[0];
    return (
      <div style={{ maxWidth, lineHeight: 'normal' }}>
        <DragDropContext onDragEnd={this.onDrag}>
          <div ref={this.setWidth}>
            {rows.map((row, rowIdx) => (
              <React.Fragment key={rowIdx}>
                {emptyDroppable(rowIdx + 100)}
                <Droppable
                  key={rowIdx}
                  droppableId={`${rowIdx}`}
                  direction="horizontal"
                  ignoreContainerClipping={true}
                >
                  {(provided, snapshot) => (
                    <div
                      style={{ height: 32, display: 'flex' }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {row.buttons.map((button, buttonIdx) => (
                        <Draggable key={button.id} draggableId={`${button.id}`} index={buttonIdx}>
                          {(provided, snapshot) => {
                            const style = { ...provided.draggableProps.style };

                            let w = snapshot.isDragging
                              ? width /
                                ((rows[snapshot.draggingOver] || row).buttons.length +
                                  (snapshot.draggingOver !== `${rowIdx}` ? 1 : 0))
                              : width / row.buttons.length;
                            w = w.toFixed(2);

                            if (!snapshot.isDragging && style.transform) {
                              w = width / (row.buttons.length + 1);
                              style.transform = `translate(${w}px, 0px)`;
                            }
                            style.width = snapshot.isDragging ? `${w}px` : `100%`;

                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={style}
                                className="telegram-btn-drag"
                              >
                                <div
                                  className={`ant-btn telegram-btn ${
                                    button.action ? 'has-action' : ''
                                  }`}
                                  onClick={() => this.showModal(button)}
                                >
                                  <div className="telegram-btn-tags">{button.tags.join(' ')}</div>
                                  {button.title.toString()}
                                </div>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </React.Fragment>
            ))}
            {emptyDroppable(rows.length + 100)}
          </div>
        </DragDropContext>

        <TelegramActionMenuButtonModal
          key={this.state.button?.id}
          button={this.state.button}
          visible={this.state.modalVisible}
          hideModal={this.hideModal}
          delButton={this.delButton}
          saveButton={this.saveButton}
          node={node}
        />

        <Button type="default" onClick={this.addButton}>
          + Add button
        </Button>
      </div>
    );
  }
}
